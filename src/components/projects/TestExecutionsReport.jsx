import React, { useRef, useState } from "react";
import { Card, Table, Button, Dropdown, DropdownButton } from "react-bootstrap";
import html2pdf from "html2pdf.js";

const TestExecutionsReport = ({ generatedReport }) => {
    const cardRef = useRef(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortBy, setSortBy] = useState('testexecutionID');
    const [selectedResult, setSelectedResult] = useState(null);

    const handleExportPDF = () => {
        if (!generatedReport || !generatedReport.testexecutions) {
            return;
        }

        const opt = {
            margin: 1,
            filename: `TestExecutionsReport_${generatedReport.project_id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        const clonedCardRef = cardRef.current.cloneNode(true);
        const filterButtons = clonedCardRef.querySelectorAll(".dropdown-toggle");
        filterButtons.forEach((button) => {
            const parentElement = button.parentNode;
            if (parentElement) {
                parentElement.parentNode.removeChild(parentElement);
            }
        });
        const exportButton = clonedCardRef.querySelector("button");
        if (exportButton) {
            exportButton.parentNode.removeChild(exportButton);
        }

        html2pdf().from(clonedCardRef).set(opt).save();
    };

    const handleExportCSV = () => {
        if (!generatedReport || !generatedReport.testexecutions) {
            return;
        }

        const headers = ["Test Execution ID", "Test Plan ID", "Result", "Number of Execution", "Total Percentage"];
        const rows = generatedReport.testexecutions.map(testexecution => [
            testexecution.testexecutionID,
            testexecution.data.testplanID,
            getResultName(testexecution.data.result_id),
            testexecution.data.number_of_execution,
            testexecution.total_percentage
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "TestExecutionsReport.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getResultName = (result_id) => {
        switch (result_id) {
            case 1:
                return 'To Do';
            case 2:
                return 'In Progress';
            case 3:
                return 'Pass';
            case 4:
                return 'Fail';
            case 5:
                return 'Blocked';
            case 6:
                return 'Passed with Restriction';
            default:
                return '';
        }
    };

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDirection('asc');
        }
    };

    const filterByResult = (result_id) => {
        setSelectedResult(result_id);
    };

    if (!generatedReport || !generatedReport.testexecutions) {
        return <div></div>;
    }

    let filteredTestexecutions = generatedReport.testexecutions.slice();

    if (selectedResult !== null) {
        filteredTestexecutions = filteredTestexecutions.filter(testexecution => testexecution.data.result_id === selectedResult);
    }

    const sortedTestexecutions = filteredTestexecutions.sort((a, b) => {
        if (sortDirection === 'asc') {
            return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
            return a[sortBy] < b[sortBy] ? 1 : -1;
        }
    });

    return (
        <Card ref={cardRef}>
            <Card.Body>
                <Card.Title>Test Executions Report</Card.Title>
                <div className="d-flex justify-content-start gap-2 mb-3">
                    <DropdownButton variant="secondary" title={`Result: ${selectedResult !== null ? getResultName(selectedResult) : 'All'}`}>
                        <Dropdown.Item onClick={() => filterByResult(1)}>To Do</Dropdown.Item>
                        <Dropdown.Item onClick={() => filterByResult(2)}>In Progress</Dropdown.Item>
                        <Dropdown.Item onClick={() => filterByResult(3)}>Pass</Dropdown.Item>
                        <Dropdown.Item onClick={() => filterByResult(4)}>Fail</Dropdown.Item>
                        <Dropdown.Item onClick={() => filterByResult(5)}>Blocked</Dropdown.Item>
                        <Dropdown.Item onClick={() => filterByResult(6)}>Passed with Restriction</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => filterByResult(null)}>Clear Result Filter</Dropdown.Item>
                    </DropdownButton>
                </div>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th onClick={() => toggleSort('testexecutionID')}>
                                Test Execution ID
                                {sortBy === 'testexecutionID' && <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>}
                            </th>
                            <th onClick={() => toggleSort('testplanID')}>
                                Test Plan ID
                                {sortBy === 'testplanID' && <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>}
                            </th>
                            <th onClick={() => toggleSort('result_id')}>
                                Result
                                {sortBy === 'result_id' && <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>}
                            </th>
                            <th>Number of Execution</th>
                            <th onClick={() => toggleSort('total_percentage')}>
                                Total Percentage
                                {sortBy === 'total_percentage' && <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTestexecutions.map((testexecution) => (
                            <tr key={testexecution.id}>
                                <td>{testexecution.testexecutionID}</td>
                                <td>{testexecution.data.testplanID}</td>
                                <td>{getResultName(testexecution.data.result_id)}</td>
                                <td>{testexecution.data.number_of_execution}</td>
                                <td>{testexecution.total_percentage}%</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="d-flex justify-content-end mt-3">
                    <Button onClick={handleExportPDF} className="me-2">Export PDF</Button>
                    <Button onClick={handleExportCSV}>Export CSV</Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default TestExecutionsReport;
