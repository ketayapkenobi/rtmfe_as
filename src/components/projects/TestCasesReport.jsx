import React, { useRef } from "react";
import { Card, Table, Button } from "react-bootstrap";
import html2pdf from "html2pdf.js";

const TestCasesReport = ({ generatedReport }) => {
    const cardRef = useRef(null);

    const handleExportPDF = () => {
        if (!generatedReport || !generatedReport.testcases) {
            return;
        }

        const opt = {
            margin: 1,
            filename: `TestCasesReport_${projectID}.pdf`,
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

    if (!generatedReport || !generatedReport.testcases) {
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
                <Card.Title>Test Cases Report</Card.Title>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Test Case ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Priority</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {generatedReport.testcases.map((testcase) => (
                            <tr key={testcase.id}>
                                <td>{testcase.testcaseID}</td>
                                <td>{testcase.name}</td>
                                <td>{testcase.description}</td>
                                <td>{getPriorityName(testcase.priority_id)}</td>
                                <td>{getStatusName(testcase.status_id)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button onClick={handleExportPDF}>Export PDF</Button>
            </Card.Body>
        </Card>
    );
};

export default TestCasesReport;
