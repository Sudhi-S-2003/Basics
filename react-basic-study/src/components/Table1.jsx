import React from 'react'

function Table1() {
    return (
        <div> <table class="min-w-full border border-gray-200 text-sm">
            <thead class="bg-gray-100">
                <tr>
                    <th class="px-4 py-2 border">Unread</th>
                    <th class="px-4 py-2 border">Request ID</th>
                    <th class="px-4 py-2 border">Status</th>
                    <th class="px-4 py-2 border">Name</th>
                    <th class="px-4 py-2 border">Description</th>
                </tr>
            </thead>

            <tbody>
                {/* <!-- Unread row --> */}
                <tr class="hover:bg-gray-50 bg-blue-50">
                    <td class="px-4 py-2 border">
                        <span class="h-3 w-3 inline-block rounded-full bg-blue-500"></span>
                    </td>
                    <td class="px-4 py-2 border">REQ12345</td>
                    <td class="px-4 py-2 border">
                        <span class="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">Pending</span>
                    </td>
                    <td class="px-4 py-2 border">Appu</td>
                    <td class="px-4 py-2 border">New freezer request</td>
                </tr>

                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-2 border">
                        <span class="h-3 w-3 inline-block rounded-full bg-gray-300"></span>
                    </td>
                    <td class="px-4 py-2 border">REQ98765</td>
                    <td class="px-4 py-2 border">
                        <span class="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Approved</span>
                    </td>
                    <td class="px-4 py-2 border">John</td>
                    <td class="px-4 py-2 border">Store audit complete</td>
                </tr>
            </tbody>
        </table></div>
    )
}

export default Table1