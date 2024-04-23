import React from "react";

const TestExecutionsReport = ({ testExecutions }) => (
    <div>
        <h3>Test Executions Report</h3>
        <ul>
            {testExecutions.map((testExecution) => (
                <li key={testExecution.id}>{testExecution.name}</li>
            ))}
        </ul>
    </div>
);

export default TestExecutionsReport;
