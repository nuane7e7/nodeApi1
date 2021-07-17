function  getArgument() {
  arguments[3] = "hello"
  console.log([...arguments])
}
getArgument(1, 2, 3,4)