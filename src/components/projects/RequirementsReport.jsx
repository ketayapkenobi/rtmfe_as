import React, { useRef, useState } from "react";
import { Card, Table, Button, Dropdown, DropdownButton } from "react-bootstrap";
import html2pdf from "html2pdf.js";

const RequirementsReport = ({ generatedReport }) => {
    const cardRef = useRef(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortBy, setSortBy] = useState('requirementID');
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const handleExportPDF = () => {
        if (!generatedReport || !generatedReport.requirements) {
            return;
        }

        const projectID = generatedReport.requirements[0].project_id; // Assuming all requirements belong to the same project

        const opt = {
            margin: 1,
            filename: `RequirementsReport_${projectID}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' } // Set orientation to landscape
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

    if (!generatedReport || !generatedReport.requirements) {
        return <div></div>;
    }

    let filteredRequirements = generatedReport.requirements.slice();

    if (selectedPriority !== null) {
        filteredRequirements = filteredRequirements.filter(requirement => requirement.priority_id === selectedPriority);
    }

    if (selectedStatus !== null) {
        filteredRequirements = filteredRequirements.filter(requirement => requirement.status_id === selectedStatus);
    }

    const sortedRequirements = filteredRequirements.sort((a, b) => {
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
                <Card.Title>Requirements Report</Card.Title>
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
                            <th onClick={() => toggleSort('requirementID')}>
                                Requirement ID
                                {sortBy === 'requirementID' && <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>}
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
                            <th>Test Cases</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRequirements.map((requirement) => (
                            <tr key={requirement.id}>
                                <td>{requirement.requirementID}</td>
                                <td>{requirement.name}</td>
                                <td>{requirement.description}</td>
                                <td>{getPriorityName(requirement.priority_id)}</td>
                                <td>{getStatusName(requirement.status_id)}</td>
                                <td>{requirement.test_cases ? requirement.test_cases.join(", ") : ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button onClick={handleExportPDF}>Export PDF</Button>
            </Card.Body>
        </Card>
    );
};

export default RequirementsReport;
