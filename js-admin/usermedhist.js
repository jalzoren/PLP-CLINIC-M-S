document.addEventListener("DOMContentLoaded", function () {
    fetch("../php-user/usermedhist.php")
        .then(response => response.json())
        .then(data => {
            // Helper function to set value if element exists
            function setValue(id, value) {
                const el = document.getElementById(id);
                if (el) el.value = value;
            }

            // Helper function to set checked if element exists
            function setChecked(id, checked) {
                const el = document.getElementById(id);
                if (el) el.checked = checked;
            }

            // Populate general patient fields
            [
                "identification", "lastname", "firstname", "middlename", "gender",
                "age", "birthdate", "religion", "nationality", "contact", "civilstatus",
                "address", "city", "province", "zipcode", "email"
            ].forEach(id => {
                setValue(id, data[id] || "");
            });

            // Emergency contact
            [
                "emergencyLastname", "emergencyFirstname", "emergencymiddlename",
                "relationship", "emergencycontact", "emergencyaddress", "emergencycity",
                "emergencyprovince", "emergencyzipcode"
            ].forEach(id => {
                setValue(id, data[id] || "");
            });

            // Student Info
            if (data.student_department?.trim()) {
                setValue("collegeDepartment", data.student_department);
                setValue("collegeProgram", data.program || "");
                setValue("batch", data.batch || "");
            } else {
                ["collegeDepartment", "collegeProgram", "batch"].forEach(id => {
                    setValue(id, "");
                });
            }

            // Personnel Info
            if (data.personnel_department?.trim()) {
                setValue("departmentPersonnel", data.personnel_department);
            } else if (!data.student_department?.trim()) {
                setValue("departmentPersonnel", "");
            }

            // Student/Personnel Category Checkboxes
            setChecked("studentCheckbox", false);
            setChecked("personnelCheckbox", false);
            setChecked("teaching", false);
            setChecked("nonTeaching", false);

            if (data.category === "student") {
                setChecked("studentCheckbox", true);
            } else if (data.category === "teaching" || data.category === "non-teaching") {
                setChecked("personnelCheckbox", true);

                if (data.personnel_type === "teaching") {
                    setChecked("teaching", true);
                } else if (data.personnel_type === "non-teaching") {
                    setChecked("nonTeaching", true);
                }
            }

            // Smoking History
            const smokingUsageStatus = (data.smoking_usage_status || "").toLowerCase();
            const smokingStartDate = data.smoking_start_date || "";
            const smokingStopDate = data.smoking_stop_date || "";
            const smokingTypesUsed = data.smoking_types_used || [];

            document.querySelectorAll('input[name="usageStatus"]').forEach(input => {
                if(input) input.checked = input.value.toLowerCase() === smokingUsageStatus;
            });

            setValue("stoppedDate", smokingStopDate);

            ["cigarette", "vape", "pipe"].forEach(type => {
                const cb = document.getElementById(type);
                if (cb) cb.checked = false;
            });
            setValue("sticksperday", "");
            setValue("cigaretteStartedDate", "");

            smokingTypesUsed.forEach(typeObj => {
                const type = (typeObj.type || "").toLowerCase();
                const cb = document.getElementById(type);
                if (cb) {
                    cb.checked = true;
                    if (type === "cigarette") {
                        setValue("sticksperday", typeObj.sticks_per_day || "");
                        setValue("cigaretteStartedDate", smokingStartDate);
                    }
                }
            });

            // Maternal History
            setValue("numberOfPreg", data.no_of_pregnancy || "");
            setValue("numberOfMiscarriage", data.no_of_miscarriage || "");
            setValue("numberOfTermdeliveries", data.no_terms_of_delivery || "");
            setValue("numberOfPrematureDeliveries", data.no_of_premature_delivery || "");
            setValue("totalnumberofChildren", data.total_children || "");

            // Alcohol
            setValue("totalperconsupAlchoText", data.estimated_per_consumption || "");
            setChecked("oncePerWeekalcohol", data.alcohol_frequency === "Once per week");
            setChecked("moreThanonceperweekalcohol", data.alcohol_frequency === "More than once per week");

            // Surgical History
            if (data.has_surgical_history === "none") {
                setChecked("noneSurgery", true);
                setValue("surgicalText", "");
            } else {
                setChecked("surgical", true);
                setValue("surgicalText", data.surgical_specify || "");
            }

            // Medical Conditions
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
                "Others": "otherMedical"
            };

            Object.values(conditionMap).forEach(id => {
                setChecked(id, false);
            });
            setValue("allergiesText", "");
            setValue("otherMedicalText", "");
            setValue("maintenanceMedications", "");

            if (Array.isArray(data.medical_conditions)) {
                data.medical_conditions.forEach(item => {
                    const conditionName = item.Medical_Condition?.trim().toLowerCase();
                    const matchKey = Object.keys(conditionMap).find(key => key.toLowerCase() === conditionName);
                    if (matchKey) {
                        const checkboxId = conditionMap[matchKey];
                        setChecked(checkboxId, true);

                        if (checkboxId === "allergies") {
                            setValue("allergiesText", item.Details || "");
                        }
                        if (checkboxId === "otherMedical") {
                            setValue("otherMedicalText", item.Details || "");
                        }
                    }

                    if (item.Med_Maintenance) {
                        setValue("maintenanceMedications", item.Med_Maintenance);
                    }
                });
            }

            // Drugs
            const drugsUsageStatus = (data.drugs_usage_status || "").toLowerCase();
            document.querySelectorAll('input[name="drugsStatus"]').forEach(cb => {
                if(cb) cb.checked = (cb.value.toLowerCase() === drugsUsageStatus);
            });

            const substancesUsed = (data.drugs_substances_used || []).map(s => s.toLowerCase());
            document.querySelectorAll('input[name="substances[]"]').forEach(cb => {
                if(cb) cb.checked = substancesUsed.includes(cb.value.toLowerCase());
            });

            const rehabStatus = (data.rehabilitation_status || "").toLowerCase();
            document.querySelectorAll('input[name="rehabilitation"]').forEach(cb => {
                if(cb) cb.checked = (cb.value.toLowerCase() === rehabStatus);
            });

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

            Object.values(familyConditionMap).forEach(id => {
                setChecked(id, false);
            });
            setValue("FamHisallergiesText", "");
            setValue("SpecifyFamHisText", "");

            if (Array.isArray(data.family_history)) {
                data.family_history.forEach(item => {
                    const conditionName = item.Medical_Condition?.trim().toLowerCase();
                    const matchKey = Object.keys(familyConditionMap).find(
                        key => key.toLowerCase() === conditionName
                    );
                    if (matchKey) {
                        const checkboxId = familyConditionMap[matchKey];
                        setChecked(checkboxId, true);

                        if (checkboxId === "FamHisallergiesCheckbox") {
                            setValue("FamHisallergiesText", item.Details || "");
                        }
                        if (checkboxId === "SpecifyFamHisCheckbox") {
                            setValue("SpecifyFamHisText", item.Details || "");
                        }
                    }
                });
            }

            // Full name placeholder
            const namePlaceholder = document.getElementById("patient-name-placeholder");
            if (namePlaceholder) {
                const fullName = `${data.firstname || ""} ${data.middlename || ""} ${data.lastname || ""}`.trim();
                namePlaceholder.textContent = fullName;
            }
        })
        .catch(err => console.error("Error loading data:", err));
});
