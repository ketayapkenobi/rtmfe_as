import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';

function RelateRequirementsModal({ show, handleClose, requirements, testcaseID, updateRequirements, selectedRequirements }) {
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        if (show && selectedRequirements) {
            const initialSelectedOptions = selectedRequirements.map(requirementID => {
                const requirement = requirements.find(req => req.requirementID === requirementID);
                return requirement ? { value: requirement.requirementID, label: `${requirement.requirementID} - ${requirement.name}` } : null;
            }).filter(option => option !== null);
            setSelectedOptions(initialSelectedOptions);
        }
    }, [show, selectedRequirements, requirements]);

    const handleSaveChanges = () => {
        const updatedRequirements = selectedOptions.map(option => option.value);
        updateRequirements(testcaseID, updatedRequirements);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select Requirements for Test Case {testcaseID}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Select
                    options={requirements.map(requirement => ({
                        value: requirement.requirementID,
                        label: `${requirement.requirementID} - ${requirement.name}`
                    }))}
                    isMulti
                    value={selectedOptions}
                    onChange={setSelectedOptions}
                    classNamePrefix="react-select"
                />
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
}

export default RelateRequirementsModal;
