import React, { useRef, useState } from "react";
import { Card, Table, Button, Dropdown, DropdownButton } from "react-bootstrap";
import html2pdf from "html2pdf.js";

const TestPlansReport = ({ generatedReport }) => {
    const cardRef = useRef(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortBy, setSortBy] = useState('testplanID');
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const handleExportPDF = () => {
        if (!generatedReport || !generatedReport.testplans) {
            return;
        }

        const opt = {
            margin: 1,
            filename: `TestPlanReport.pdf`,
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

    if (!generatedReport || !generatedReport.testplans) {
        return <div></div>;
    }

    let filteredTestplans = generatedReport.testplans.slice();

    if (selectedPriority !== null) {
        filteredTestplans = filteredTestplans.filter(testplan => testplan.priority_id === selectedPriority);
    }

    if (selectedStatus !== null) {
        filteredTestplans = filteredTestplans.filter(testplan => testplan.status_id === selectedStatus);
    }

    const sortedTestplans = filteredTestplans.sort((a, b) => {
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
                <Card.Title>Test Plans Report</Card.Title>
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
                            <th onClick={() => toggleSort('testplanID')}>
                                Test Plan ID
                                {sortBy === 'testplanID' && <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>}
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
                            <th>Related Test Cases</th> {/* New column for related test cases */}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTestplans.map((testplan) => (
                            <tr key={testplan.id}>
                                <td>{testplan.testplanID}</td>
                                <td>{testplan.name}</td>
                                <td>{testplan.description}</td>
                                <td>{getPriorityName(testplan.priority_id)}</td>
                                <td>{getStatusName(testplan.status_id)}</td>
                                <td>{testplan.test_cases ? testplan.test_cases.join(", ") : ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button onClick={handleExportPDF}>Export PDF</Button>
            </Card.Body>
        </Card>
    );
};

export default TestPlansReport;
