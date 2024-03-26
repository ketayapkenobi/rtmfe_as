import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function RelateRequirementsModal({ show, handleClose, requirements, testcaseID, updateRequirements, selectedRequirements }) {
    const [checkedRequirements, setCheckedRequirements] = useState([]);

    useEffect(() => {
        if (show && selectedRequirements) {
            setCheckedRequirements(selectedRequirements);
        }
    }, [show, selectedRequirements]);

    const handleCheckboxChange = (requirementID) => {
        if (checkedRequirements.includes(requirementID)) {
            setCheckedRequirements(checkedRequirements.filter(req => req !== requirementID));
        } else {
            setCheckedRequirements([...checkedRequirements, requirementID]);
        }
    };

    const handleSaveChanges = () => {
        updateRequirements(testcaseID, checkedRequirements);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select Requirements for Test Case {testcaseID}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {requirements.map(requirement => (
                    <Form.Check
                        key={requirement.id}
                        type="checkbox"
                        id={`requirement-${requirement.id}`}
                        label={`${requirement.requirementID} - ${requirement.name}`}
                        checked={checkedRequirements.includes(requirement.requirementID)}
                        onChange={() => handleCheckboxChange(requirement.requirementID)}
                    />
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSaveChanges}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RelateRequirementsModal;
