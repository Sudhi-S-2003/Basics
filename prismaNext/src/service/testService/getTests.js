import { prisma } from "@/lib/prisma";
import successResponse from "@/middleware/successResponse";
import validateQuery from "@/middleware/validateQuery";

const getTests = async (req) => {
 const query = validateQuery(req);
  const { page, limit, search } = query;

  const skip = (page - 1) * limit;

  // Fetch data and total count in parallel
  const [tests, total] = await Promise.all([
    prisma.test.findMany({
      skip,
      take: limit,
    }),
    prisma.test.count(),
  ]);

  const pagination = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };

  return successResponse({ data: tests, status: 200, pagination, message: "Tests fetched successfully" });
};

export default getTests;
