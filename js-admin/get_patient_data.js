document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const patientId = params.get("patient_id");

    if (!patientId) {
        console.warn("No patient_id in URL");
        return;
    }

    fetch("../php/get_patient_data.php?patient_id=" + patientId)
        .then(response => response.json())
        .then(data => {
            // Populate general patient fields
            [
                "identification", "lastname", "firstname", "middlename", "gender",
                "age", "birthdate", "religion", "nationality", "contact", "civilstatus",
                "address", "city", "province", "zipcode"
            ].forEach(id => {
                document.getElementById(id).value = data[id] || "";
            });

            // Emergency contact
            [
                "emergencyLastname", "emergencyFirstname", "emergencymiddlename",
                "relationship", "emergencycontact", "emergencyaddress", "emergencycity",
                "emergencyprovince", "emergencyzipcode"
            ].forEach(id => {
                document.getElementById(id).value = data[id] || "";
            });

            // Student Info
            if (data.student_department?.trim()) {
                document.getElementById("collegeDepartment").value = data.student_department;
                document.getElementById("collegeProgram").value = data.program || "";
                document.getElementById("batch").value = data.batch || "";
            } else {
                ["collegeDepartment", "collegeProgram", "batch"].forEach(id => {
                    document.getElementById(id).value = "";
                });
            }

            // Personnel Info
            if (data.personnel_department?.trim()) {
                document.getElementById("departmentPersonnel").value = data.personnel_department;
            } else if (!data.student_department?.trim()) {
                document.getElementById("departmentPersonnel").value = "";
            }

            // Student/Personnel Category Checkboxes
            document.getElementById("studentCheckbox").checked = false;
            document.getElementById("personnelCheckbox").checked = false;
            document.getElementById("teaching").checked = false;
            document.getElementById("nonTeaching").checked = false;
            
            if (data.category === "student") {
                document.getElementById("studentCheckbox").checked = true;
            } else if (data.category === "teaching" || data.category === "non-teaching") {
                document.getElementById("personnelCheckbox").checked = true;
            
                if (data.personnel_type === "teaching") {
                    document.getElementById("teaching").checked = true;
                } else if (data.personnel_type === "non-teaching") {
                    document.getElementById("nonTeaching").checked = true;
                }
            }
            


            // Smoking History
            const smokingUsageStatus = (data.smoking_usage_status || "").toLowerCase();
            const smokingStartDate = data.smoking_start_date || "";
            const smokingStopDate = data.smoking_stop_date || "";
            const smokingTypesUsed = data.smoking_types_used || [];
        
            document.querySelectorAll('input[name="usageStatus"]').forEach(input => {
                input.checked = input.value.toLowerCase() === smokingUsageStatus;
            });
        
            document.getElementById("stoppedDate").value = smokingStopDate;
        
            ["cigarette", "vape", "pipe"].forEach(type => {
                const cb = document.getElementById(type);
                if (cb) cb.checked = false;
            });
            document.getElementById("sticksperday").value = "";
            document.getElementById("cigaretteStartedDate").value = "";
        
            smokingTypesUsed.forEach(typeObj => {
                const type = (typeObj.type || "").toLowerCase();
                const cb = document.getElementById(type);
                if (cb) {
                    cb.checked = true;
                    if (type === "cigarette") {
                        document.getElementById("sticksperday").value = typeObj.sticks_per_day || "";
                        document.getElementById("cigaretteStartedDate").value = smokingStartDate;
                    }
                }
            });
        


            // Maternal History
            document.getElementById("numberOfPreg").value = data.no_of_pregnancy || "";
            document.getElementById("numberOfMiscarriage").value = data.no_of_miscarriage || "";
            document.getElementById("numberOfTermdeliveries").value = data.no_terms_of_delivery || "";
            document.getElementById("numberOfPrematureDeliveries").value = data.no_of_premature_delivery || "";
            document.getElementById("totalnumberofChildren").value = data.total_children || "";

            // Alcohol
            document.getElementById("totalperconsupAlchoText").value = data.estimated_per_consumption || "";
            if (data.alcohol_frequency === "Once per week") {
                document.getElementById("oncePerWeekalcohol").checked = true;
            } else if (data.alcohol_frequency === "More than once per week") {
                document.getElementById("moreThanonceperweekalcohol").checked = true;
            }

            // Surgical History
            if (data.has_surgical_history === "none") {
                document.getElementById("noneSurgery").checked = true;
            } else {
                document.getElementById("surgical").checked = true;
                document.getElementById("surgicalText").value = data.surgical_specify || "";
            }


            // --- Handle medical_conditions from same response ---
            const conditionMap = {
                "Hypertension": "hypertension",
                "Tubercolosis": "tubercolosis",
                "High Cholesterol": "highCholesterol",
                "Allergies": "allergies",
                "Diabetes": "diabetes",
                "Thyroid Problems": "thyroidProblems",
                "Cancer": "cancer",
                "Asthma": "asthma",
                "Emphysema": "emphysema",
                "Other Medical": "otherMedical"
            };

            // Uncheck all condition checkboxes
            Object.values(conditionMap).forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox) checkbox.checked = false;
            }); 
            document.getElementById("allergiesText").value = "";
            document.getElementById("otherMedicalText").value = "";
            document.getElementById("maintenanceMedications").value = "";

            if (Array.isArray(data.medical_conditions)) {
                data.medical_conditions.forEach(item => {
                    const conditionName = item.Medical_Condition?.trim().toLowerCase();
                    const matchKey = Object.keys(conditionMap).find(key => key.toLowerCase() === conditionName);
                    if (matchKey) {
                        const checkboxId = conditionMap[matchKey];
                        const checkbox = document.getElementById(checkboxId);
                        if (checkbox) checkbox.checked = true;

                        if (checkboxId === "allergies") {
                            document.getElementById("allergiesText").value = item.Details || "";
                        }
                        if (checkboxId === "otherMedical") {
                            document.getElementById("otherMedicalText").value = item.Details || "";
                        }
                    }

                    if (item.Med_Maintenance) {
                        document.getElementById("maintenanceMedications").value = item.Med_Maintenance;
                    }
                });
            }

            // Drugs
            const drugsUsageStatus = (data.drugs_usage_status || "").toLowerCase();
            document.querySelectorAll('input[name="drugsStatus"]').forEach(cb => {
                cb.checked = (cb.value.toLowerCase() === drugsUsageStatus);
            });

            // Substances Used (checkboxes with name="substances[]")
            const substancesUsed = (data.drugs_substances_used || []).map(s => s.toLowerCase());
            document.querySelectorAll('input[name="substances[]"]').forEach(cb => {
                cb.checked = substancesUsed.includes(cb.value.toLowerCase());
            });

            // Rehabilitation Status (checkboxes with name="rehabilitation")
            const rehabStatus = (data.rehabilitation_status || "").toLowerCase();
            document.querySelectorAll('input[name="rehabilitation"]').forEach(cb => {
                cb.checked = (cb.value.toLowerCase() === rehabStatus);
            });


        // Family History
        // Family History
        const familyConditionMap = {
            "Hypertension": "FamHishypertension",
            "Diabetes": "FamHisdiabetes",
            "Allergies": "FamHisallergiesCheckbox",
            "High Cholesterol": "FamHishighCholesterol",
            "Cancer": "FamHiscancer",
            "Asthma": "FamHisasthma",
            "Tubercolosis": "FamHistubercolosis",
            "Emphysema": "FamHisemphysema",
            "Thyroid Problems": "FamHisthyroidProblems",
            "Other": "SpecifyFamHisCheckbox"
        };

        // Uncheck all family history checkboxes and clear text fields
        Object.values(familyConditionMap).forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = false;
        });
        document.getElementById("FamHisallergiesText").value = "";
        document.getElementById("SpecifyFamHisText").value = "";

        if (Array.isArray(data.family_history)) {
            data.family_history.forEach(item => {
                const conditionName = item.Medical_Condition?.trim().toLowerCase();
                const matchKey = Object.keys(familyConditionMap).find(
                    key => key.toLowerCase() === conditionName
                );
                if (matchKey) {
                    const checkboxId = familyConditionMap[matchKey];
                    const checkbox = document.getElementById(checkboxId);
                    if (checkbox) checkbox.checked = true;

                    // Handle text input for Allergies and Other
                    if (checkboxId === "FamHisallergiesCheckbox") {
                        document.getElementById("FamHisallergiesText").value = item.Details || "";
                    }
                    if (checkboxId === "SpecifyFamHisCheckbox") {
                        document.getElementById("SpecifyFamHisText").value = item.Details || "";
                    }
                }
            });
        }



        })
        .catch(err => console.error("Error loading data:", err));
});
