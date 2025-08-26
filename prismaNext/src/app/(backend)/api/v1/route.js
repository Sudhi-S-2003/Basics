import errorWrapper from "@/middleware/errorWrapper";
import { getTests, createTest } from "@/service/testService";


export const GET = errorWrapper(getTests);
export const POST = errorWrapper(createTest);
