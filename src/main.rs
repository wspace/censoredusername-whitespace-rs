extern crate whitespacers;

use std::env;
use std::io::{self, Write, Read, BufRead};
use std::fs::File;
use std::time::Instant;
use std::error::Error;

use whitespacers::{Program, JitInterpreter, Options, IGNORE_OVERFLOW, UNCHECKED_HEAP};
use whitespacers::State;

#[derive(Debug, Clone)]
struct Args {
    program: String,        // this is where we read the program from.
    options: Options,       // any options to influence execution
    input: Option<String>,  // this is where we read input for the program from. if None, stdin
    output: Option<String>, // this is where we output data to. if None, stdin
    format: FileFormat,     // format of input file. default is Whitespace
    action: Action,         // output format. translate or execute.
    debug: Option<String>,  // file to dump the jit executable buffer to.
    perf: bool              // print perf info to stdout?
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum FileFormat {
    Whitespace,
    Assembly
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum Action {
    Translate,
    Execute,
    Jit(JitStrategy)
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum JitStrategy {
    AoT,
    Sync,
    Async
}

fn main() {
    match console_main() {
        Ok(()) => (),
        Err(s) => write!(io::stderr(), "{}\n", s).unwrap()
    }
}

fn console_main() -> Result<(), String> {
    let time_start = Instant::now();

    let args = try!(parse_args());

    let time_args = Instant::now();

    let data = {
        let mut file = try!(File::open(&args.program).map_err(|e| e.to_string()));

        let mut data = String::new();

        try!(file.read_to_string(&mut data).map_err(|e| e.to_string()));

        data
    };

    let time_input = Instant::now();

    let program = try!(match args.format {
        FileFormat::Whitespace => Program::parse(data.as_bytes()),
        FileFormat::Assembly => Program::assemble(&data)
    });

    let time_parse = Instant::now();

    let mut output: Box<Write> = if let Some(path) = args.output {
        Box::new(io::BufWriter::new(
            try!(File::create(&path).map_err(|e| e.to_string()))
        ))
    } else {
        Box::new(io::BufWriter::new(
            io::stdout()
        ))
    };

    let mut time_compiling = None;

    match args.action {
        Action::Translate => try!(
            match args.format {
                FileFormat::Whitespace => output.write_all(program.disassemble().as_bytes()),
                FileFormat::Assembly   => output.write_all(program.dump(true).as_slice())
            }.map_err(|e| e.to_string())
        ),
        _ => {
            let mut input: Box<BufRead> = if let Some(path) = args.input {
                Box::new(io::BufReader::new(
                    try!(File::open(&path).map_err(|e| e.to_string()))
                ))
            } else {
                Box::new(io::BufReader::new(
                    io::stdin()
                ))
            };
            match args.action {
                Action::Execute => {
                    try!(whitespacers::simple_interpret(&program, args.options, &mut input, &mut output).map_err(|e| e.description().to_string()));
                },
                Action::Jit(strategy) => {
                    let mut jitinterpreter = JitInterpreter::new(&program, args.options, &mut input, &mut output);
                    let res = match strategy {
                        JitStrategy::AoT => {
                            jitinterpreter.precompile();
                            if let Some(filename) = args.debug {
                                try!(jitinterpreter.dump(filename).map_err(|e| e.to_string()));
                            }
                            time_compiling = Some(Instant::now());
                            jitinterpreter.simple_jit()
                        },
                        JitStrategy::Sync => jitinterpreter.synchronous_jit(),
                        JitStrategy::Async => jitinterpreter.threaded_jit()
                    }.map_err(|mut e| {e.set_location(*jitinterpreter.state.index()); e.description().to_string()});
                    try!(res);
                },
                _ => unreachable!()
            };
        }
    }

    let time_finish = Instant::now();

    if args.perf {
        let duration = time_args - time_start;
        println!("Time spent parsing args: {}.{:09}", duration.as_secs(), duration.subsec_nanos());

        let duration = time_input - time_args;
        println!("Time spent reading:      {}.{:09}", duration.as_secs(), duration.subsec_nanos());

        let duration = time_parse - time_input;
        println!("Time spent parsing:      {}.{:09}", duration.as_secs(), duration.subsec_nanos());

        if let Some(time_compiling) = time_compiling {
            let duration = time_compiling - time_parse;
            println!("Time spent compiling:    {}.{:09}", duration.as_secs(), duration.subsec_nanos());

            let duration = time_finish - time_compiling;
            println!("Time spent executing:    {}.{:09}", duration.as_secs(), duration.subsec_nanos());
        } else {
            let duration = time_finish - time_parse;
            println!("Time spent executing:    {}.{:09}", duration.as_secs(), duration.subsec_nanos());
        }
    }

    Ok(())
}

macro_rules! try_opt {
    ($o:expr, $e:expr) => (
        match $o {
            Some(x) => x,
            None => return Err($e)
        }
    )
}

fn parse_args() -> Result<Args, String> {
    let mut debug = None;
    let mut perf = false;
    let mut input = None;
    let mut output = None;
    let mut format = None;
    let mut action = Action::Execute;
    let mut options = Options::empty();

    let mut args = env::args();
    let mut pos_args = Vec::new();
    // discard executable name
    args.next();

    // sort out args and kwargs (also parsing kwargs)
    loop {
        match args.next() {
            Some(arg) => match arg.as_ref() {
                "-d" | "--debug" => if let Some(_) = debug {
                    return Err("Option --debug was specified twice".to_string());
                } else {
                    debug = Some(try_opt!(args.next(), "Missing argument to --debug".to_string()));
                },
                "-p" | "--perf" => if perf {
                    return Err("Option --perf was specified twice".to_string());
                } else {
                    perf = true;
                },
                "-i" | "--input" => if let Some(_) = input {
                    return Err("Option --input was specified twice".to_string());
                } else {
                    input = Some(try_opt!(args.next(), "Missing argument to --input".to_string()));
                },
                "-o" | "--output" => if let Some(_) = output {
                    return Err("Option --output was specified twice".to_string());
                } else {
                    output = Some(try_opt!(args.next(), "Missing argument to --output".to_string()));
                },
                "-f" | "--format" => if let Some(_) = format {
                    return Err("Option --format was specified twice".to_string());
                } else {
                    format = match try_opt!(args.next(), "Missing argument to --format".to_string()).as_ref() {
                        "whitespace" | "ws" => Some(FileFormat::Whitespace),
                        "assembly" | "asm"  => Some(FileFormat::Assembly),
                        f => return Err(format!("Unrecognized input format {}", f))
                    };
                },
                "-t" | "--translate" => if action != Action::Execute {
                    return Err("Option --translate or --jit was specified twice".to_string());
                } else {
                    action = Action::Translate;
                },
                "-j" | "--jit" => if action != Action::Execute {
                    return Err("Option --translate or --jit was specified twice".to_string());
                } else {
                    action = match try_opt!(args.next(), "Missing argument to --jit".to_string()).as_ref() {
                        "aot"   => Action::Jit(JitStrategy::AoT),
                        "sync"  => Action::Jit(JitStrategy::Sync),
                        "async" => Action::Jit(JitStrategy::Async),
                        a => return Err(format!("Unrecognized jit strategy {}", a))
                    };
                },
                "--ignore-overflow" => if options.contains(IGNORE_OVERFLOW) {
                    return Err("Option --ignore-overflow was specified twice".to_string());
                } else {
                    options |= IGNORE_OVERFLOW;
                },
                "--unchecked-heap" => if options.contains(UNCHECKED_HEAP) {
                    return Err("Option --unchecked-heap was specified twice".to_string());
                } else {
                    options |= UNCHECKED_HEAP;
                },
                "-h" | "--help" => return Err("Usage: whitespacers INPUT [-h | -i INFILE | -o OUTFILE | [-t | -j] | -f FORMAT]

Options:
    -h --help            Display this message
    -d --debug  DUMPFILE Stores the resulting executable buffer from jitting to a file.
    -p --perf            Prints performance information to stdout.
    -i --input  INFILE   File to read input from (defaults to stdin)
    -o --output OUTFILE  File to write output to (defaults to stdout)
    -f --format FORMAT   Input file format. Supported options are [whitespace|ws|assembly|asm],
                          the default is whitespace.
    -t --translate       Translate the file from whitespace to assembly (or in reverse).
    -j --jit STRATEGY    Execute the file using jit techniques. Options are [aot|sync|async]
".to_string()),
                "--" => {
                    pos_args.extend(args);
                    break;
                },
                _ => if arg.chars().next() == Some('-') {
                    return Err(format!("Unrecognized option {}", arg));
                } else {
                    pos_args.push(arg);
                }
            },
            None => break
        }
    }

    // parse positional args
    let mut pos_args = pos_args.into_iter();
    let program = try_opt!(pos_args.next(), "Missing required positional argument 'program'".to_string());
    if let Some(x) = pos_args.next() {
        return Err(format!("Unexpected positional argument {}", x));
    }

    return Ok(Args {
        program: program,
        options: options,
        input: input,
        output: output,
        format: format.unwrap_or(FileFormat::Whitespace),
        action: action,
        debug: debug,
        perf: perf
    })
}
