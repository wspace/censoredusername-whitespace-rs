var searchIndex = {};
searchIndex["whitespacers"] = {"doc":"","items":[[3,"Interpreter","whitespacers","A whitespace interpreter. This struct provides various strategies for interpreting a whitespace program.",null,null],[3,"Program","","This struct contains the internal representation of a whitespace program.",null,null],[3,"Options","","These are bitflag options to alter the behaviour of the interpreter.",null,null],[3,"WsError","","The common error type returned from all whitespacers execution functions.",null,null],[12,"kind","","The kind of error that occurred.",0,null],[4,"WsErrorKind","","Simple information on what kind of error occurred.",null,null],[13,"ParseError","","Compile-time parse error",1,null],[13,"StackError","","The stack was not of the correct size to execute an instruction.",1,null],[13,"KeyError","","A missing key was requested from the heap.",1,null],[13,"InvalidIndex","","The program tried to execute an instruction that doesn't exist (generally caused by control flow hitting the end of the program).",1,null],[13,"CallStackError","","The program tried to return but there was no location to return to on the callstack.",1,null],[13,"DivisionError","","Division or Modulo by zero.",1,null],[13,"IOError","","Something went wrong while trying to read from input or write to output.",1,null],[13,"RuntimeParseError","","The program tried to read a number but no number was given.",1,null],[13,"Overflow","","An overflow occurred during an arithmetric operation. This will normally not be returned unless fallback is disabled.",1,null],[13,"InumOverflow","","An overflow occurred when a number input was requested. This is a bit of a special case, as the state cannot be rewound to before the number was parsed. Therefore, the key where the number will be read to, and the  oversized integer that was parsed are returned in the error, and the location at which the error occurred is set to be the operation after the failed inum operation. Again, this will not be returned unless fallback is disabled.",1,null],[5,"debug_compile","","Returns a buffer containing the output of the compilation process of the specified program. This is mainly useful for debugging and optimizing the performance of the JIT compiler.",null,{"inputs":[{"name":"program"},{"name":"options"}],"output":{"name":"vec"}}],[11,"new","","Construct a new whitespace interpreter from a program, input stream and output stream with the specified options.",2,{"inputs":[{"name":"program"},{"name":"options"},{"name":"bufread"},{"name":"write"}],"output":{"name":"interpreter"}}],[11,"count_with_simple_state","","Similar to Interpreter::interpret_with_simple_state but does not have bigint fallback and returns the amount of executed instructions on success.",2,{"inputs":[{"name":"self"}],"output":{"name":"result"}}],[11,"interpret_with_simple_state","","The reference interpreter implementation. It uses simple data structures internally, falling back to bignum-based simple datastructures if values become too large.",2,{"inputs":[{"name":"self"}],"output":{"name":"result"}}],[11,"interpret_with_fast_state","","Interprets the program with optimized data structures, falling back to bignum-based simple datastructures if values become too large. ",2,{"inputs":[{"name":"self"}],"output":{"name":"result"}}],[11,"interpret_with_bigint_state","","Interpret the program using only bignum-based simple datastructures. This is slow.",2,{"inputs":[{"name":"self"}],"output":{"name":"result"}}],[11,"jit_aot","","Use a jit compiler that compiles the entire program in advance to execute the program. It is backed by an optimized datastructure, and will fall back to interpretation in unsafe situations. When values become too large it will fall back to bignum-based interpretation.",2,{"inputs":[{"name":"self"}],"output":{"name":"result"}}],[11,"jit_sync","","Use a jit compiler that compiles code synchronously while executing the program. It is backed by an optimized datastructure, and will fall back to interpretation in unsafe situations. When values become too large it will fall back to bignum-based interpretation.",2,{"inputs":[{"name":"self"}],"output":{"name":"result"}}],[11,"jit_threaded","","Use a jit compiler that compiles the program in a separate thread while executing the program. It is backed by an optimized datastructure, and will fall back to interpretation in unsafe situations. When values become too large it will fall back to bignum-based interpretation.",2,{"inputs":[{"name":"self"}],"output":{"name":"result"}}],[11,"strip","","Remove source location information from the program.",3,{"inputs":[{"name":"self"}],"output":null}],[11,"parse","","Parse a program written in whitespace to a format suitable for execution.",3,{"inputs":[{"name":"vec"}],"output":{"name":"result"}}],[11,"dump","","Serialize the internal representation back into a whitespace program.",3,{"inputs":[{"name":"self"}],"output":{"name":"vec"}}],[11,"disassemble","","Disassemble a program into a human-readable whitespace assembly.",3,{"inputs":[{"name":"self"}],"output":{"name":"string"}}],[11,"assemble","","Parse a program written in whitespace assembly into a program.",3,{"inputs":[{"name":"string"}],"output":{"name":"result"}}],[17,"IGNORE_OVERFLOW","","Use wrapping arithmetric instead of detecting overflow and falling back",null,null],[17,"UNCHECKED_HEAP","","When an unknown key used to get an item from the heap, return 0 instead of causing an error.",null,null],[17,"NO_FALLBACK","","Don't fall back to biginteger interpretation on overflow, instead return an overflow error.",null,null],[11,"fmt","","",3,{"inputs":[{"name":"self"},{"name":"formatter"}],"output":{"name":"result"}}],[11,"clone","","",3,{"inputs":[{"name":"self"}],"output":{"name":"program"}}],[11,"eq","","",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":{"name":"bool"}}],[11,"ne","","",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":{"name":"bool"}}],[11,"clone","","",4,{"inputs":[{"name":"self"}],"output":{"name":"options"}}],[11,"partial_cmp","","",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":{"name":"option"}}],[11,"lt","","",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":{"name":"bool"}}],[11,"le","","",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":{"name":"bool"}}],[11,"gt","","",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":{"name":"bool"}}],[11,"ge","","",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":{"name":"bool"}}],[11,"cmp","","",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":{"name":"ordering"}}],[11,"hash","","",4,null],[11,"fmt","","",4,{"inputs":[{"name":"self"},{"name":"formatter"}],"output":{"name":"result"}}],[11,"fmt","","",4,{"inputs":[{"name":"self"},{"name":"formatter"}],"output":{"name":"result"}}],[11,"fmt","","",4,{"inputs":[{"name":"self"},{"name":"formatter"}],"output":{"name":"result"}}],[11,"fmt","","",4,{"inputs":[{"name":"self"},{"name":"formatter"}],"output":{"name":"result"}}],[11,"fmt","","",4,{"inputs":[{"name":"self"},{"name":"formatter"}],"output":{"name":"result"}}],[11,"empty","","Returns an empty set of flags.",4,{"inputs":[],"output":{"name":"options"}}],[11,"all","","Returns the set containing all flags.",4,{"inputs":[],"output":{"name":"options"}}],[11,"bits","","Returns the raw value of the flags currently stored.",4,{"inputs":[{"name":"self"}],"output":{"name":"u8"}}],[11,"from_bits","","Convert from underlying bit representation, unless that representation contains bits that do not correspond to a flag.",4,{"inputs":[{"name":"u8"}],"output":{"name":"option"}}],[11,"from_bits_truncate","","Convert from underlying bit representation, dropping any bits that do not correspond to flags.",4,{"inputs":[{"name":"u8"}],"output":{"name":"options"}}],[11,"is_empty","","Returns `true` if no flags are currently stored.",4,{"inputs":[{"name":"self"}],"output":{"name":"bool"}}],[11,"is_all","","Returns `true` if all flags are currently set.",4,{"inputs":[{"name":"self"}],"output":{"name":"bool"}}],[11,"intersects","","Returns `true` if there are flags common to both `self` and `other`.",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":{"name":"bool"}}],[11,"contains","","Returns `true` all of the flags in `other` are contained within `self`.",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":{"name":"bool"}}],[11,"insert","","Inserts the specified flags in-place.",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":null}],[11,"remove","","Removes the specified flags in-place.",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":null}],[11,"toggle","","Toggles the specified flags in-place.",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":null}],[11,"set","","Inserts or removes the specified flags depending on the passed value.",4,{"inputs":[{"name":"self"},{"name":"options"},{"name":"bool"}],"output":null}],[11,"bitor","","Returns the union of the two sets of flags.",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":{"name":"options"}}],[11,"bitor_assign","","Adds the set of flags.",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":null}],[11,"bitxor","","Returns the left flags, but with all the right flags toggled.",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":{"name":"options"}}],[11,"bitxor_assign","","Toggles the set of flags.",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":null}],[11,"bitand","","Returns the intersection between the two sets of flags.",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":{"name":"options"}}],[11,"bitand_assign","","Disables all flags disabled in the set.",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":null}],[11,"sub","","Returns the set difference of the two sets of flags.",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":{"name":"options"}}],[11,"sub_assign","","Disables all flags enabled in the set.",4,{"inputs":[{"name":"self"},{"name":"options"}],"output":null}],[11,"not","","Returns the complement of this set of flags.",4,{"inputs":[{"name":"self"}],"output":{"name":"options"}}],[11,"extend","","",4,{"inputs":[{"name":"self"},{"name":"t"}],"output":null}],[11,"from_iter","","",4,{"inputs":[{"name":"t"}],"output":{"name":"options"}}],[11,"fmt","","",0,{"inputs":[{"name":"self"},{"name":"formatter"}],"output":{"name":"result"}}],[11,"fmt","","",1,{"inputs":[{"name":"self"},{"name":"formatter"}],"output":{"name":"result"}}],[11,"clone","","",1,{"inputs":[{"name":"self"}],"output":{"name":"wserrorkind"}}],[11,"format_with_program","","Provide a nice error message using information stored in the program structure",0,{"inputs":[{"name":"self"},{"name":"program"}],"output":{"name":"string"}}],[11,"fmt","","",0,{"inputs":[{"name":"self"},{"name":"formatter"}],"output":{"name":"result"}}],[11,"description","","",0,{"inputs":[{"name":"self"}],"output":{"name":"str"}}],[11,"cause","","",0,{"inputs":[{"name":"self"}],"output":{"name":"option"}}],[11,"from","","",0,{"inputs":[{"name":"error"}],"output":{"name":"wserror"}}]],"paths":[[3,"WsError"],[4,"WsErrorKind"],[3,"Interpreter"],[3,"Program"],[3,"Options"]]};
searchIndex["wsc"] = {"doc":"","items":[],"paths":[]};
initSearch(searchIndex);
