
// //match any one of the [A-Z]
// const reqex=new RegExp("[A-Z]");


// //match any one of the excude [^A-Z]
// const reqex=new RegExp("[^A-Z]");

// //match any one of the digits \d
// const reqex=new RegExp(/\d/); //equivalent to [0-9]

// //match any one of the non-digits \D
//  const reqex=new RegExp(/\D/);//equivalent to [^0-9]

// //match any one of the word characters \w
// const reqex=new RegExp(/\w/);//equivalent to [A-Za-z0-9_]

// //match any one of the non-word characters \W
// const reqex=new RegExp(/\W/);//equivalent to [^A-Za-z0-9_]


// //match any one of the whitespace characters \s
// const reqex = new RegExp(/\s/);//equivalent to [ \t\n\r\f\v]
// //match any one of the non-whitespace characters \S
// const reqex=new RegExp(/\S/);//equivalent to [^ \t\n\r\f\v]

//match the word boundary \b
// const reqex=new RegExp(/\bapp/);//matches "app" at the beginning of a word
// console.log(reqex.test("3appu"));
// //match the non-word boundary \B
// const reqex=new RegExp(/\Bapp/);//matches "app" not at the beginning of a word
// console.log(reqex.test("appu"));
//Boundary-type assertions

// //match the beginning of a string ^
// const reqex=new RegExp(/^app/);//matches "app" at the beginning of a string
// console.log(reqex.test("appu"));
// //match the end of a string $
// const reqex2=new RegExp(/app$/);//matches "app" at the end of a string
// console.log(reqex2.test("my app"));

// //match the beginning and end of a string ^...$
// const reqex=new RegExp(/^app$/);//matches "app" as the entire string
// console.log(reqex.test("app"));

//Other assertions

// //positive lookahead assertion (?=...)
// const reqex=new RegExp(/app(?=le)/);//matches "app" only if followed by "le"
// console.log(reqex.test("apple"));
// console.log(reqex.test("appapple2"));

// //negative lookahead assertion (?!...)
// const reqex2=new RegExp(/app(?!le)/);//matches "app" only if not followed by "le"
// console.log(reqex2.test("appu"));


//Groups and backreferences

// // //grouping with parentheses (...)
// const reqex=new RegExp(/(app){2}/);//matches "app" repeated minimun twice
// console.log(reqex.test("app"));//false only once
// console.log(reqex.test("appapp"));//true twice
// console.log(reqex.test("appappapp"));//true three times  more than twice
// // //backreference \1, \2, ...
// const reqex2=new RegExp(/(app)\1/);//matches "app" followed by the same "app"
// console.log(reqex2.test("appapp"));//true  if "app" is repeated number of times
// console.log(reqex2.test("app"));//false only once
// console.log(reqex2.test("appappapp"));// true more than twice repeated.


// Quantifiers
// //zero or more times *
// const reqex=new RegExp(/appl*/);//matches "app" followed by zero or more "l"
// console.log(reqex.test("app"));//true  zero l
// console.log(reqex.test("appl"));//true one l
// console.log(reqex.test("applll"));//true more than one l
// //one or more times +
// const reqex2=new RegExp(/appl+/);//matches "app" followed by one or more "l"
// console.log(reqex2.test("app"));//false zero l
// console.log(reqex2.test("appl"));//true one l
// console.log(reqex2.test("applll"));//true more than one l
// //zero or one time ?
// const reqex3=new RegExp(/appl?/);//matches "app" followed by zero or one "l"
// console.log(reqex3.test("app"));//true zero l
// console.log(reqex3.test("appl"));//true one l
// console.log(reqex3.test("applll"));//true more than one l
//exactly n times {n}
// const reqex4=new RegExp(/appl{2}/);//matches "app" followed by minimun two "l"
// console.log(reqex4.test("appl"));//false one l
// console.log(reqex4.test("appll"));//true two l
// console.log(reqex4.test("applll"));//true more than two l

// //at least n times {n,}
// const reqex5=new RegExp(/appl{2,}/);//matches "app" followed by at least two "l"
// console.log(reqex5.test("appl"));//false one l
// console.log(reqex5.test("appll"));//true two l
// console.log(reqex5.test("applll"));//true more than two l
// // //between n and m times {n,m}
// const reqex6=new RegExp(/^appl{2,4}$/);//matches "app" followed by between two and four "l"
// console.log(reqex6.test("appl"));//false one l
// console.log(reqex6.test("appll"));//true two l
// console.log(reqex6.test("applll"));//true three l
// console.log(reqex6.test("appllll"));//true four l
// console.log(reqex6.test("applllll"));//false more than four l
