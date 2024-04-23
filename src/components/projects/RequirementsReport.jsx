import React, { useRef } from "react";
import { Card, Table, Button } from "react-bootstrap";
import html2pdf from "html2pdf.js";

const RequirementsReport = ({ generatedReport }) => {
    const cardRef = useRef(null);

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
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        const clonedCardRef = cardRef.current.cloneNode(true);
        const exportButton = clonedCardRef.querySelector("button");
        if (exportButton) {
            exportButton.parentNode.removeChild(exportButton);
        }

        html2pdf().from(clonedCardRef).set(opt).save();
    };

    if (!generatedReport || !generatedReport.requirements) {
        return <div></div>;
    }

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
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Requirement ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Priority</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {generatedReport.requirements.map((requirement) => (
                            <tr key={requirement.id}>
                                <td>{requirement.requirementID}</td>
                                <td>{requirement.name}</td>
                                <td>{requirement.description}</td>
                                <td>{getPriorityName(requirement.priority_id)}</td>
                                <td>{getStatusName(requirement.status_id)}</td>
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
