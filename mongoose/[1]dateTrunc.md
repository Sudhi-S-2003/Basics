// 🧩 Basic syntax

{
  $dateTrunc: {
    date: <expression>,   // the date field or value
    unit: <unit>,         // 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
    binSize: <number>,    // optional, group by multiple units (e.g., every 2 weeks)
    timezone: <string>,   // optional, e.g. 'Asia/Kolkata'
    startOfWeek: <string> // optional, e.g. 'Monday' (default is Sunday)
  }
}


<!-- 🗓 Example — Group by Week Using $dateTrunc -->

{
  $group: {
    _id: {
      $dateTrunc: {
        date: "$createdAt",
        unit: "week",
        timezone: "Asia/Kolkata",  // optional
        startOfWeek: "Monday"      // ISO-style week starts
      }
    },
    total: { $sum: 1 }
  }
}
