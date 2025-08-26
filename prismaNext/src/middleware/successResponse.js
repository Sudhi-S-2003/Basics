import { NextResponse } from "next/server";
 const successResponse = ({data, status = 200, pagination = null, message = null}) => {
    const isPaginated = !!pagination;

    const response = {
        success: true,
        data: data ?? [],
        ...(isPaginated && { pagination }),
        message: message ?? (Array.isArray(data) && data.length === 0 ? "No Data Found!.." : undefined),
    };

    return NextResponse.json(response, { status });
};
export default  successResponse