import React, { useRef } from "react";
import { Card, Table, Button } from "react-bootstrap";
import html2pdf from "html2pdf.js";

const TestPlansReport = ({ generatedReport }) => {
    const cardRef = useRef(null);

    const handleExportPDF = () => {
        if (!generatedReport || !generatedReport.testplans) {
            return;
        }

        const opt = {
            margin: 1,
            filename: `TestPlanReport_${projectID}.pdf`,
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

    if (!generatedReport || !generatedReport.testplans) {
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
                <Card.Title>Test Plans Report</Card.Title>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Test Plan ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Priority</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {generatedReport.testplans.map((testplan) => (
                            <tr key={testplan.id}>
                                <td>{testplan.testplanID}</td>
                                <td>{testplan.name}</td>
                                <td>{testplan.description}</td>
                                <td>{getPriorityName(testplan.priority_id)}</td>
                                <td>{getStatusName(testplan.status_id)}</td>
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
