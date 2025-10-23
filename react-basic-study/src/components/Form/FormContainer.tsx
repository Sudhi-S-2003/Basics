import Form from "./Form"
import TextInput from "./TextInput"
function FormContainer({
  formHeader = "Hello"
}: { formHeader: string }) {
  return (
    <div>
      <h1 className="text-2xl">Dynamic Form -<span className="text-4xl text-blue-600">{formHeader}</span></h1>
      <Form onSubmit={(inputs) => { console.log(inputs); }}>
        <TextInput placeholder={"Enter Name"} />
        <TextInput placeholder={"Enter Email"} type="email" />
        <TextInput placeholder={"Enter Phone"} type="number" />
      </Form>
    </div>
  )
}
export default FormContainer