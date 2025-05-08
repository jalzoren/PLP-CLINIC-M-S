-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 08, 2025 at 12:17 PM
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

-- --------------------------------------------------------

--
-- Table structure for table `maternal`
--

CREATE TABLE `maternal` (
  `Maternal_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `No._ofPregnancy` tinyint(4) NOT NULL,
  `No._ofMiscarriage` tinyint(4) NOT NULL,
  `No._TermsofDelevery` tinyint(4) NOT NULL,
  `No._ofPrematureDelivery` tinyint(4) NOT NULL,
  `TotalofChildren` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Table structure for table `personnel_patient`
--

CREATE TABLE `personnel_patient` (
  `Personnel_Patient_ID` int(11) NOT NULL,
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
  `Student_Patient_ID` int(11) NOT NULL,
  `Student_ID` int(11) NOT NULL,
  `Department` varchar(255) NOT NULL,
  `Program` varchar(255) NOT NULL,
  `Batch` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `surgical_history`
--

CREATE TABLE `surgical_history` (
  `Surgical_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `HasSurgicalHistory` varchar(5) NOT NULL,
  `Specify` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `User_ID` int(11) NOT NULL,
  `Patient_ID` int(11) DEFAULT NULL,
  `ID_Number` int(20) NOT NULL,
  `Role` varchar(20) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `Updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indexes for table `patient_condition`
--
ALTER TABLE `patient_condition`
  ADD PRIMARY KEY (`PatientCon_ID`),
  ADD KEY `patient_condition_ibfk` (`Patient_ID`);

--
-- Indexes for table `personnel_patient`
--
ALTER TABLE `personnel_patient`
  ADD PRIMARY KEY (`Personnel_Patient_ID`),
  ADD UNIQUE KEY `Personnel_ID` (`Personnel_ID`);

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
  ADD PRIMARY KEY (`Student_Patient_ID`),
  ADD UNIQUE KEY `Student_ID` (`Student_ID`);

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
  ADD UNIQUE KEY `ID_Number` (`ID_Number`),
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
  MODIFY `Alcohol_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `borroweditem_records`
--
ALTER TABLE `borroweditem_records`
  MODIFY `BorrowedItem_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `drug_history`
--
ALTER TABLE `drug_history`
  MODIFY `Drug_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `drug_typeused`
--
ALTER TABLE `drug_typeused`
  MODIFY `DrugType_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emergency_contact`
--
ALTER TABLE `emergency_contact`
  MODIFY `EmergencyContact_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `Item_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `maternal`
--
ALTER TABLE `maternal`
  MODIFY `Maternal_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `Patient_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personnel_patient`
--
ALTER TABLE `personnel_patient`
  MODIFY `Personnel_Patient_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `smoking_history`
--
ALTER TABLE `smoking_history`
  MODIFY `Smoking_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `smoking_typeused`
--
ALTER TABLE `smoking_typeused`
  MODIFY `SmokingType_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_patient`
--
ALTER TABLE `student_patient`
  MODIFY `Student_Patient_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `surgical_history`
--
ALTER TABLE `surgical_history`
  MODIFY `Surgical_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `visit_records`
--
ALTER TABLE `visit_records`
  MODIFY `Visit_ID` int(11) NOT NULL AUTO_INCREMENT;

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
-- Constraints for table `patient_condition`
--
ALTER TABLE `patient_condition`
  ADD CONSTRAINT `patient_condition_ibfk` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `personnel_patient`
--
ALTER TABLE `personnel_patient`
  ADD CONSTRAINT `personnel_patient_ibfk` FOREIGN KEY (`Personnel_Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `student_patient_ibfk` FOREIGN KEY (`Student_Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

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
