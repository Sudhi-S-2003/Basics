const pricingPipline = () => {
    return [
        // {
        //     $lookup: {
        //         from: "",
        //         localField: "",
        //         foreignField: "",
        //         as: ""
        //     }
        // }
        {
            $lookup: {
                from: "",
                let: {
                    _id: "$_id"
                },
                pipeline: [{
                    $match: {
                        $expr: {
                            // $eq:["$fieldOne","$fieldTwo"]
                            $or: [
                                { $eq: ["$fieldOne", "$fieldTwo"], },
                                { $eq: ["$fieldOne", "$fieldThree"] }
                            ]
                        }
                    }
                }],
                as: ""
            }
        }
    ]
}



// {
//     $lookup: {
//         from: "",
//             localField: "",
//                 foreignField: "",
//                     as: ""
//     }
// }
//output is array of matched collection