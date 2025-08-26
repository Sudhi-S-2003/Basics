import { prisma } from "@/lib/prisma";
import successResponse from "@/middleware/successResponse";
import validate from "@/middleware/validate";
import throwError from "@/utils/errors";

const createTest = async (req) => {  

  const { name ,age} = await validate(req);;

  // 🔴 Conflict error: 'name' already exists
  console.log({name})
  // const existing = await prisma.test.findFirst({ where: { name } });
  // if (existing) {
  //   throwError("CONFLICT_ERROR", "Test already exists");
  // }

  // ✅ Create and return new test
  const newTest = await prisma.test.create({ data: { name :age} });

  return successResponse({
    data: {}, 
    status: 201, 
    message: "Test created successfully"
  });
};

export default createTest;
