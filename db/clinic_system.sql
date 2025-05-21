-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2025 at 12:46 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clinic_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `alcohol_history`
--

CREATE TABLE `alcohol_history` (
  `Alcohol_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `ESTperConsumption` varchar(100) DEFAULT NULL,
  `Frequency` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alcohol_history`
--

INSERT INTO `alcohol_history` (`Alcohol_ID`, `Patient_ID`, `ESTperConsumption`, `Frequency`) VALUES
(6, 1, NULL, 'Once per week'),
(7, 4, NULL, 'Once per week');

-- --------------------------------------------------------

--
-- Table structure for table `borroweditem_records`
--

CREATE TABLE `borroweditem_records` (
  `BorrowedItem_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Item_ID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `Date_Borrowed` datetime NOT NULL,
  `Date_Returned` datetime DEFAULT NULL,
  `Status` varchar(50) NOT NULL,
  `Photo_Borrowed` varchar(255) NOT NULL,
  `Photo_Returned` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `borroweditem_records`
--

INSERT INTO `borroweditem_records` (`BorrowedItem_ID`, `Patient_ID`, `Item_ID`, `Quantity`, `Date_Borrowed`, `Date_Returned`, `Status`, `Photo_Borrowed`, `Photo_Returned`) VALUES
(1, 1, 1, 1, '2025-05-17 11:41:01', NULL, 'Borrowed', 'no-image.png', NULL),
(2, 1, 1, 1, '2025-05-17 11:41:24', NULL, 'Borrowed', '1747453284_borrowed.png', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `drug_history`
--

CREATE TABLE `drug_history` (
  `Drug_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Usage_Status` varchar(12) DEFAULT NULL,
  `Rehub_Undergone` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drug_history`
--

INSERT INTO `drug_history` (`Drug_ID`, `Patient_ID`, `Usage_Status`, `Rehub_Undergone`) VALUES
(3, 1, 'Never', ''),
(4, 4, 'Never', '');

-- --------------------------------------------------------

--
-- Table structure for table `drug_typeused`
--

CREATE TABLE `drug_typeused` (
  `DrugType_ID` int(11) NOT NULL,
  `Drug_ID` int(11) NOT NULL,
  `Type` varchar(15) DEFAULT NULL,
  `CustomDrugName` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `emergency_contact`
--

CREATE TABLE `emergency_contact` (
  `EmergencyContact_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Last_Name` varchar(50) NOT NULL,
  `First_Name` varchar(50) NOT NULL,
  `Middle_Name` varchar(50) DEFAULT NULL,
  `Relationship` varchar(50) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `City` varchar(50) NOT NULL,
  `Province` varchar(50) NOT NULL,
  `Zip_Code` varchar(10) NOT NULL,
  `Contact_Number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emergency_contact`
--

INSERT INTO `emergency_contact` (`EmergencyContact_ID`, `Patient_ID`, `Last_Name`, `First_Name`, `Middle_Name`, `Relationship`, `Address`, `City`, `Province`, `Zip_Code`, `Contact_Number`) VALUES
(6, 1, 'Bitancor', 'Miah', 'Amora', 'Myself', 'san miguel', 'Pasig City', 'Metro Manila', '1600', 2147483647),
(7, 4, 'Bitancor', 'Jerimiah', 'Amora', 'Classmate', 'San MIguel', 'Pasig City', 'Metro Manila', '1600', 2147483647);

-- --------------------------------------------------------

--
-- Table structure for table `family_history`
--

CREATE TABLE `family_history` (
  `FamHistory_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Medical_Condition` varchar(255) DEFAULT NULL,
  `Details` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `family_history`
--

INSERT INTO `family_history` (`FamHistory_ID`, `Patient_ID`, `Medical_Condition`, `Details`) VALUES
(1, 1, 'Asthma', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `Item_ID` int(11) NOT NULL,
  `Item_Name` varchar(100) NOT NULL,
  `Category` varchar(20) NOT NULL,
  `Status` varchar(20) NOT NULL,
  `Quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`Item_ID`, `Item_Name`, `Category`, `Status`, `Quantity`) VALUES
(1, 'Crutches', 'Supplies', 'Unavailable', 2),
(2, 'Stethoscope', 'Equipment', 'Available', 3),
(3, 'Heat Pack', 'First Aid', 'Available', 6),
(4, 'Arm Sling', 'First Aid', 'Available', 5),
(5, 'First Aid Kit', 'First Aid', 'Available', 3),
(6, 'Cold Pack (Reusable)', 'First Aid', 'Available', 5),
(7, 'Elastic Bandage (4 inch)', 'First Aid', 'Available', 10),
(8, 'Digital Thermometer', 'Equipment', 'Available', 3),
(9, 'Crutches (Adjustable)', 'Equipment', 'Available', 2);

-- --------------------------------------------------------

--
-- Table structure for table `maternal`
--

CREATE TABLE `maternal` (
  `Maternal_ID` int(11) NOT NULL,
  `Patient_ID` int(11) DEFAULT NULL,
  `No_ofPregnancy` tinyint(4) DEFAULT NULL,
  `No_ofMiscarriage` tinyint(4) DEFAULT NULL,
  `No_TermsofDelevery` tinyint(4) DEFAULT NULL,
  `No_ofPrematureDelivery` tinyint(4) DEFAULT NULL,
  `TotalofChildren` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maternal`
--

INSERT INTO `maternal` (`Maternal_ID`, `Patient_ID`, `No_ofPregnancy`, `No_ofMiscarriage`, `No_TermsofDelevery`, `No_ofPrematureDelivery`, `TotalofChildren`) VALUES
(6, 1, NULL, NULL, NULL, NULL, NULL),
(7, 4, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `Patient_ID` int(11) NOT NULL,
  `Category` varchar(20) NOT NULL,
  `First_Name` varchar(50) NOT NULL,
  `Middle_Name` varchar(50) DEFAULT NULL,
  `Last_Name` varchar(50) NOT NULL,
  `Sex` varchar(10) NOT NULL,
  `Age` tinyint(4) NOT NULL,
  `Birthdate` date NOT NULL,
  `Civil_Status` varchar(20) NOT NULL,
  `Religion` varchar(50) NOT NULL,
  `Nationality` varchar(50) NOT NULL,
  `Contact_Number` int(15) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `City` varchar(50) NOT NULL,
  `Province` varchar(50) NOT NULL,
  `Zip_Code` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`Patient_ID`, `Category`, `First_Name`, `Middle_Name`, `Last_Name`, `Sex`, `Age`, `Birthdate`, `Civil_Status`, `Religion`, `Nationality`, `Contact_Number`, `Address`, `City`, `Province`, `Zip_Code`) VALUES
(1, 'student', 'Jerimiah', 'Amora', 'Bitancor', 'Male', 19, '2005-08-15', 'Single', 'Catholic', 'Filipino', 2147483647, 'san miguel', 'Pasig City', 'Metro Manila', '1600'),
(4, 'student', 'Bianca Rain', 'Cagurungan', 'Castillon', 'Female', 20, '2005-01-03', 'Single', 'Cathollic', 'Filipino', 2147483647, 'Brgy. San Joaquin', 'Pasig City', 'Metro Manila', '1601');

-- --------------------------------------------------------

--
-- Table structure for table `patient_assessment`
--

CREATE TABLE `patient_assessment` (
  `Assessment_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Temperature` decimal(4,1) DEFAULT NULL,
  `Pulse` tinyint(3) UNSIGNED DEFAULT NULL,
  `Respiratory_Rate` tinyint(3) UNSIGNED DEFAULT NULL,
  `Blood_Pressure` varchar(7) DEFAULT NULL,
  `Height` decimal(5,2) DEFAULT NULL,
  `Weight` decimal(5,2) DEFAULT NULL,
  `BMI` decimal(4,1) DEFAULT NULL,
  `Recorded_at` datetime DEFAULT NULL,
  `Physicians_Note` text DEFAULT NULL,
  `Nurse_Note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patient_condition`
--

CREATE TABLE `patient_condition` (
  `PatientCon_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Medical_Condition` varchar(20) DEFAULT NULL,
  `Details` varchar(255) DEFAULT NULL,
  `Med_Maintenance` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patient_medical_record`
--

CREATE TABLE `patient_medical_record` (
  `Medical_Record_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `PatientCon_ID` int(11) NOT NULL,
  `FamHistory_ID` int(11) NOT NULL,
  `EmergencyContact_ID` int(11) NOT NULL,
  `Maternal_ID` int(11) NOT NULL,
  `Surgical_ID` int(11) NOT NULL,
  `Alcohol_ID` int(11) NOT NULL,
  `Smoking_ID` int(11) NOT NULL,
  `Drug_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personnel_patient`
--

CREATE TABLE `personnel_patient` (
  `Patient_ID` int(11) NOT NULL,
  `Personnel_ID` int(11) NOT NULL,
  `Department` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `smoking_history`
--

CREATE TABLE `smoking_history` (
  `Smoking_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Usage_Status` varchar(15) DEFAULT NULL,
  `Start_Date` date DEFAULT NULL,
  `Stop_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `smoking_history`
--

INSERT INTO `smoking_history` (`Smoking_ID`, `Patient_ID`, `Usage_Status`, `Start_Date`, `Stop_Date`) VALUES
(3, 1, 'never', NULL, NULL),
(4, 4, 'triedonce', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `smoking_typeused`
--

CREATE TABLE `smoking_typeused` (
  `SmokingType_ID` int(11) NOT NULL,
  `Smoking_ID` int(11) NOT NULL,
  `Type` varchar(100) DEFAULT NULL,
  `StickperDay` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_patient`
--

CREATE TABLE `student_patient` (
  `Patient_ID` int(11) NOT NULL,
  `Student_ID` int(11) NOT NULL,
  `Department` varchar(255) NOT NULL,
  `Program` varchar(255) NOT NULL,
  `Batch` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_patient`
--

INSERT INTO `student_patient` (`Patient_ID`, `Student_ID`, `Department`, `Program`, `Batch`) VALUES
(4, 2300295, 'College of Computer Studies (CCS)', 'Bachelor of Science in Information Technology (BSIT)', '2025'),
(1, 2300298, 'College of Computer Studies (CCS)', 'Bachelor of Science in Information Technology (BSIT)', '2025');

-- --------------------------------------------------------

--
-- Table structure for table `surgical_history`
--

CREATE TABLE `surgical_history` (
  `Surgical_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `HasSurgicalHistory` varchar(5) DEFAULT NULL,
  `Specify` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `surgical_history`
--

INSERT INTO `surgical_history` (`Surgical_ID`, `Patient_ID`, `HasSurgicalHistory`, `Specify`) VALUES
(3, 1, 'none', NULL),
(4, 4, 'none', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `User_ID` int(11) NOT NULL,
  `Patient_ID` int(11) DEFAULT NULL,
  `Role` varchar(20) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`User_ID`, `Patient_ID`, `Role`, `Email`, `Password`) VALUES
(1, NULL, 'admin', 'clinicadmin@plpasig.edu.ph', '$2y$10$nDLTyFTcw/U8ZBFdsCpk9.RL.Q7UnlkC4HgPVzSbI7PpBZCMk37mO'),
(2, NULL, 'staff', 'clinicstaff@plpasig.edu.ph', '$2y$10$f9dPLsiFyLtPuDr3..hft.NNjWS4ojAPJ5lS1Gla8gt3a9EORosg2'),
(14, 1, 'user', 'bitancor_jerimiah@plpasig.edu.ph', '$2y$10$41rY5YnH9bV4xRAMR3BfCOKfR0QsmzXfqPd4SVi0fI.mKbvuh4Ac2'),
(15, 4, 'user', 'castillon_biancarain@plpasig.edu.ph', '$2y$10$odxS2J9YZ/g/kxr/ydw.geeyxCTTdoa6dhrn5YwM9ZvJE6J6mZHiG');

-- --------------------------------------------------------

--
-- Table structure for table `visit_records`
--

CREATE TABLE `visit_records` (
  `Visit_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Time_In` datetime NOT NULL,
  `Time_Out` datetime NOT NULL,
  `Reason` varchar(255) NOT NULL,
  `Medicine` varchar(255) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Remarks` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `visit_records`
--

INSERT INTO `visit_records` (`Visit_ID`, `Patient_ID`, `Time_In`, `Time_Out`, `Reason`, `Medicine`, `Quantity`, `Remarks`) VALUES
(1, 1, '2025-05-17 02:19:26', '0000-00-00 00:00:00', 'Menstrual cramps', NULL, NULL, ''),
(2, 4, '2025-05-17 02:26:54', '2025-05-17 09:17:38', 'Menstrual cramps', 'Paracetamol', 1, 'she will be fine, she needs sleep'),
(3, 1, '2025-05-17 05:30:06', '0000-00-00 00:00:00', 'HEUHEUH', NULL, NULL, ''),
(4, 4, '2025-05-17 05:39:25', '0000-00-00 00:00:00', 'Headache', NULL, NULL, ''),
(5, 4, '2025-05-17 05:46:36', '2025-05-17 11:47:27', 'Headache', 'paracetamol', 1, 'good'),
(6, 1, '2025-05-20 21:31:28', '0000-00-00 00:00:00', 'Headache', NULL, NULL, ''),
(7, 1, '2025-05-20 21:31:37', '0000-00-00 00:00:00', 'Toothache', NULL, NULL, ''),
(8, 1, '2025-05-21 00:15:15', '0000-00-00 00:00:00', 'Headache', NULL, NULL, ''),
(9, 1, '2025-05-21 00:15:57', '0000-00-00 00:00:00', 'Headache', NULL, NULL, ''),
(10, 1, '2025-05-21 10:39:37', '0000-00-00 00:00:00', 'Menstrual cramps', NULL, NULL, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alcohol_history`
--
ALTER TABLE `alcohol_history`
  ADD PRIMARY KEY (`Alcohol_ID`),
  ADD KEY `alcohol_history_ibfk` (`Patient_ID`);

--
-- Indexes for table `borroweditem_records`
--
ALTER TABLE `borroweditem_records`
  ADD PRIMARY KEY (`BorrowedItem_ID`),
  ADD KEY `borroweditem_patients_ibfk` (`Patient_ID`),
  ADD KEY `borroweditem_records_ibfk` (`Item_ID`);

--
-- Indexes for table `drug_history`
--
ALTER TABLE `drug_history`
  ADD PRIMARY KEY (`Drug_ID`),
  ADD KEY `drug_history_ibfk` (`Patient_ID`);

--
-- Indexes for table `drug_typeused`
--
ALTER TABLE `drug_typeused`
  ADD PRIMARY KEY (`DrugType_ID`),
  ADD KEY `drug_typeused_ibfk` (`Drug_ID`);

--
-- Indexes for table `emergency_contact`
--
ALTER TABLE `emergency_contact`
  ADD PRIMARY KEY (`EmergencyContact_ID`),
  ADD KEY `emergency_contact_ibfk` (`Patient_ID`);

--
-- Indexes for table `family_history`
--
ALTER TABLE `family_history`
  ADD PRIMARY KEY (`FamHistory_ID`),
  ADD KEY `family_history_ibfk` (`Patient_ID`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`Item_ID`);

--
-- Indexes for table `maternal`
--
ALTER TABLE `maternal`
  ADD PRIMARY KEY (`Maternal_ID`),
  ADD KEY `maternal_ibfk` (`Patient_ID`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`Patient_ID`);

--
-- Indexes for table `patient_assessment`
--
ALTER TABLE `patient_assessment`
  ADD PRIMARY KEY (`Assessment_ID`),
  ADD KEY `patient_assessment` (`Patient_ID`);

--
-- Indexes for table `patient_condition`
--
ALTER TABLE `patient_condition`
  ADD PRIMARY KEY (`PatientCon_ID`),
  ADD KEY `patient_condition_ibfk` (`Patient_ID`);

--
-- Indexes for table `patient_medical_record`
--
ALTER TABLE `patient_medical_record`
  ADD PRIMARY KEY (`Medical_Record_ID`),
  ADD KEY `patient_medical_record` (`Patient_ID`),
  ADD KEY `patientcon_medical_record` (`PatientCon_ID`),
  ADD KEY `famhistory_medical_record` (`FamHistory_ID`),
  ADD KEY `contact_medical_record` (`EmergencyContact_ID`),
  ADD KEY `maternal_medical_record` (`Maternal_ID`),
  ADD KEY `surgical_medical_record` (`Surgical_ID`),
  ADD KEY `alcohol_medical_record` (`Alcohol_ID`),
  ADD KEY `smoking_medical_record` (`Smoking_ID`),
  ADD KEY `drug_medical_record` (`Drug_ID`);

--
-- Indexes for table `personnel_patient`
--
ALTER TABLE `personnel_patient`
  ADD PRIMARY KEY (`Personnel_ID`),
  ADD UNIQUE KEY `Personnel_ID` (`Personnel_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`);

--
-- Indexes for table `smoking_history`
--
ALTER TABLE `smoking_history`
  ADD PRIMARY KEY (`Smoking_ID`),
  ADD KEY `smoking_history_ibfk` (`Patient_ID`);

--
-- Indexes for table `smoking_typeused`
--
ALTER TABLE `smoking_typeused`
  ADD PRIMARY KEY (`SmokingType_ID`),
  ADD KEY `smoking_typeused_ibfk` (`Smoking_ID`);

--
-- Indexes for table `student_patient`
--
ALTER TABLE `student_patient`
  ADD PRIMARY KEY (`Student_ID`),
  ADD UNIQUE KEY `Student_ID` (`Student_ID`),
  ADD KEY `student_patient_ibfk` (`Patient_ID`);

--
-- Indexes for table `surgical_history`
--
ALTER TABLE `surgical_history`
  ADD PRIMARY KEY (`Surgical_ID`),
  ADD KEY `surgical_ibfk` (`Patient_ID`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`User_ID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `Patient_ID` (`Patient_ID`);

--
-- Indexes for table `visit_records`
--
ALTER TABLE `visit_records`
  ADD PRIMARY KEY (`Visit_ID`),
  ADD KEY `visit_records_ibfk` (`Patient_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alcohol_history`
--
ALTER TABLE `alcohol_history`
  MODIFY `Alcohol_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `borroweditem_records`
--
ALTER TABLE `borroweditem_records`
  MODIFY `BorrowedItem_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `drug_history`
--
ALTER TABLE `drug_history`
  MODIFY `Drug_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `drug_typeused`
--
ALTER TABLE `drug_typeused`
  MODIFY `DrugType_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emergency_contact`
--
ALTER TABLE `emergency_contact`
  MODIFY `EmergencyContact_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `family_history`
--
ALTER TABLE `family_history`
  MODIFY `FamHistory_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `Item_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `maternal`
--
ALTER TABLE `maternal`
  MODIFY `Maternal_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `Patient_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `patient_assessment`
--
ALTER TABLE `patient_assessment`
  MODIFY `Assessment_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patient_medical_record`
--
ALTER TABLE `patient_medical_record`
  MODIFY `Medical_Record_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `smoking_history`
--
ALTER TABLE `smoking_history`
  MODIFY `Smoking_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `smoking_typeused`
--
ALTER TABLE `smoking_typeused`
  MODIFY `SmokingType_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `surgical_history`
--
ALTER TABLE `surgical_history`
  MODIFY `Surgical_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `visit_records`
--
ALTER TABLE `visit_records`
  MODIFY `Visit_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alcohol_history`
--
ALTER TABLE `alcohol_history`
  ADD CONSTRAINT `alcohol_history_ibfk` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `borroweditem_records`
--
ALTER TABLE `borroweditem_records`
  ADD CONSTRAINT `borroweditem_patients_ibfk` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `borroweditem_records_ibfk` FOREIGN KEY (`Item_ID`) REFERENCES `item` (`Item_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `drug_history`
--
ALTER TABLE `drug_history`
  ADD CONSTRAINT `drug_history_ibfk` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `drug_typeused`
--
ALTER TABLE `drug_typeused`
  ADD CONSTRAINT `drug_typeused_ibfk` FOREIGN KEY (`Drug_ID`) REFERENCES `drug_history` (`Drug_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `emergency_contact`
--
ALTER TABLE `emergency_contact`
  ADD CONSTRAINT `emergency_contact_ibfk` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `family_history`
--
ALTER TABLE `family_history`
  ADD CONSTRAINT `family_history_ibfk` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `maternal`
--
ALTER TABLE `maternal`
  ADD CONSTRAINT `maternal_ibfk` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `patient_assessment`
--
ALTER TABLE `patient_assessment`
  ADD CONSTRAINT `patient_assessment` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `patient_condition`
--
ALTER TABLE `patient_condition`
  ADD CONSTRAINT `patient_condition_ibfk` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `patient_medical_record`
--
ALTER TABLE `patient_medical_record`
  ADD CONSTRAINT `alcohol_medical_record` FOREIGN KEY (`Alcohol_ID`) REFERENCES `alcohol_history` (`Alcohol_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `contact_medical_record` FOREIGN KEY (`EmergencyContact_ID`) REFERENCES `emergency_contact` (`EmergencyContact_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drug_medical_record` FOREIGN KEY (`Drug_ID`) REFERENCES `drug_history` (`Drug_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `famhistory_medical_record` FOREIGN KEY (`FamHistory_ID`) REFERENCES `family_history` (`FamHistory_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `maternal_medical_record` FOREIGN KEY (`Maternal_ID`) REFERENCES `maternal` (`Maternal_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `patient_medical_record` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `patientcon_medical_record` FOREIGN KEY (`PatientCon_ID`) REFERENCES `patient_condition` (`PatientCon_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `smoking_medical_record` FOREIGN KEY (`Smoking_ID`) REFERENCES `smoking_history` (`Smoking_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `surgical_medical_record` FOREIGN KEY (`Surgical_ID`) REFERENCES `surgical_history` (`Surgical_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `personnel_patient`
--
ALTER TABLE `personnel_patient`
  ADD CONSTRAINT `personnel_patient_ibfk` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `smoking_history`
--
ALTER TABLE `smoking_history`
  ADD CONSTRAINT `smoking_history_ibfk` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `smoking_typeused`
--
ALTER TABLE `smoking_typeused`
  ADD CONSTRAINT `smoking_typeused_ibfk` FOREIGN KEY (`Smoking_ID`) REFERENCES `smoking_history` (`Smoking_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_patient`
--
ALTER TABLE `student_patient`
  ADD CONSTRAINT `student_patient_ibfk` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `surgical_history`
--
ALTER TABLE `surgical_history`
  ADD CONSTRAINT `sugical_ibfk` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfK` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `visit_records`
--
ALTER TABLE `visit_records`
  ADD CONSTRAINT `visit_records_ibfk` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
