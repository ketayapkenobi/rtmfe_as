import React, { useRef, useState } from "react";
import { Card, Table, Button, Dropdown, DropdownButton } from "react-bootstrap";
import html2pdf from "html2pdf.js";

const TestCasesReport = ({ generatedReport }) => {
    const cardRef = useRef(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortBy, setSortBy] = useState('testcaseID');
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const handleExportPDF = () => {
        if (!generatedReport || !generatedReport.testcases) {
            return;
        }

        const projectID = generatedReport.testcases[0].project_id;

        const opt = {
            margin: 1,
            filename: `TestCasesReport_${projectID}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
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
        if (!generatedReport || !generatedReport.testcases) {
            return;
        }

        const headers = ["Test Case ID", "Name", "Description", "Priority", "Status", "Requirements"];
        const rows = generatedReport.testcases.map(testcase => [
            testcase.testcaseID,
            testcase.name,
            testcase.description,
            getPriorityName(testcase.priority_id),
            getStatusName(testcase.status_id),
            testcase.requirements ? testcase.requirements.join(", ") : ""
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "TestcaseReport.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDirection('asc');
        }
    };

    const filterByPriority = (priority_id) => {
        setSelectedPriority(priority_id);
    };

    const filterByStatus = (status_id) => {
        setSelectedStatus(status_id);
    };

    if (!generatedReport || !generatedReport.testcases) {
        return <div></div>;
    }

    let filteredTestcases = generatedReport.testcases.slice();

    if (selectedPriority !== null) {
        filteredTestcases = filteredTestcases.filter(testcase => testcase.priority_id === selectedPriority);
    }

    if (selectedStatus !== null) {
        filteredTestcases = filteredTestcases.filter(testcase => testcase.status_id === selectedStatus);
    }

    const sortedTestcases = filteredTestcases.slice().sort((a, b) => {
        if (sortDirection === 'asc') {
            return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
            return a[sortBy] < b[sortBy] ? 1 : -1;
        }
    });

    const getPriorityName = (priority_id) => {
        switch (priority_id) {
            case 1:
                return 'High';
            case 2:
                return 'Medium';
            case 3:
                return 'Low';
            default:
                return '';
        }
    };

    const getStatusName = (status_id) => {
        switch (status_id) {
            case 1:
                return 'To Do';
            case 2:
                return 'In Progress';
            case 3:
                return 'Done';
            default:
                return '';
        }
    };

    return (
        <Card ref={cardRef}>
            <Card.Body>
                <Card.Title>Test Cases Report</Card.Title>
                <div className="d-flex justify-content-start gap-2 mb-3">
                    <DropdownButton variant="secondary" title={`Priority: ${selectedPriority !== null ? getPriorityName(selectedPriority) : 'All'}`}>
                        <Dropdown.Item onClick={() => filterByPriority(1)}>High Priority</Dropdown.Item>
                        <Dropdown.Item onClick={() => filterByPriority(2)}>Medium Priority</Dropdown.Item>
                        <Dropdown.Item onClick={() => filterByPriority(3)}>Low Priority</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => filterByPriority(null)}>Clear Priority Filter</Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton variant="secondary" title={`Status: ${selectedStatus !== null ? getStatusName(selectedStatus) : 'All'}`}>
                        <Dropdown.Item onClick={() => filterByStatus(1)}>To Do</Dropdown.Item>
                        <Dropdown.Item onClick={() => filterByStatus(2)}>In Progress</Dropdown.Item>
                        <Dropdown.Item onClick={() => filterByStatus(3)}>Done</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => filterByStatus(null)}>Clear Status Filter</Dropdown.Item>
                    </DropdownButton>
                </div>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th onClick={() => toggleSort('testcaseID')}>
                                Test Case ID
                                {sortBy === 'testcaseID' && <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>}
                            </th>
                            <th>Name</th>
                            <th>Description</th>
                            <th onClick={() => toggleSort('priority_id')}>
                                Priority
                                {sortBy === 'priority_id' && <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>}
                            </th>
                            <th onClick={() => toggleSort('status_id')}>
                                Status
                                {sortBy === 'status_id' && <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>}
                            </th>
                            <th>Requirements</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTestcases.map((testcase) => (
                            <tr key={testcase.id}>
                                <td>{testcase.testcaseID}</td>
                                <td>{testcase.name}</td>
                                <td>{testcase.description}</td>
                                <td>{getPriorityName(testcase.priority_id)}</td>
                                <td>{getStatusName(testcase.status_id)}</td>
                                <td>{testcase.requirements ? testcase.requirements.join(", ") : ""}</td>
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

export default TestCasesReport;
