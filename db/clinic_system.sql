-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2025 at 03:00 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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
  `Status` enum('Borrowed','Returned (Good)','Returned (Damage)','Overdue') NOT NULL,
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
  `Usage_Status` varchar(50) DEFAULT NULL,
  `Rehub_Undergone` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drug_history`
--

INSERT INTO `drug_history` (`Drug_ID`, `Patient_ID`, `Usage_Status`, `Rehub_Undergone`) VALUES
(24, 28, 'Never', ''),
(25, 29, 'Never', ''),
(26, 31, 'Never', '');

-- --------------------------------------------------------

--
-- Table structure for table `drug_typeused`
--

CREATE TABLE `drug_typeused` (
  `DrugType_ID` int(11) NOT NULL,
  `Drug_ID` int(11) NOT NULL,
  `Type` varchar(20) DEFAULT NULL
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
(24, 28, 'Alpuerto', 'Haylene', 'Mercado', 'Mother', '5 Javier St.', 'Pasig City ', 'Rizal', '1920', 2147483647),
(25, 29, 'Alpuerto', 'Haylene', 'Mercado', 'Mother', '5 Javier St.', 'Pasig City ', 'Rizal', '1920', 2147483647),
(26, 31, 'Alpuerto', 'Haylene', 'Mercado', 'Mother', '5 Javier St.', 'Pasig City ', 'Rizal', '1920', 2147483647);

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
  `Item_Name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `maternal`
--

CREATE TABLE `maternal` (
  `Maternal_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `No_ofPregnancy` int(20) DEFAULT NULL,
  `No_ofMiscarriage` int(20) DEFAULT NULL,
  `No_TermsofDelevery` int(20) DEFAULT NULL,
  `No_ofPrematureDelivery` int(20) DEFAULT NULL,
  `TotalofChildren` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maternal`
--

INSERT INTO `maternal` (`Maternal_ID`, `Patient_ID`, `No_ofPregnancy`, `No_ofMiscarriage`, `No_TermsofDelevery`, `No_ofPrematureDelivery`, `TotalofChildren`) VALUES
(24, 28, NULL, NULL, NULL, NULL, NULL),
(25, 29, NULL, NULL, NULL, NULL, NULL),
(26, 31, NULL, NULL, NULL, NULL, NULL);

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
  `Sex` enum('Male','Female','Intersex') NOT NULL,
  `Age` tinyint(4) NOT NULL,
  `Birthdate` date NOT NULL,
  `Civil_Status` varchar(20) NOT NULL,
  `Religion` varchar(50) NOT NULL,
  `Nationality` varchar(50) NOT NULL,
  `Contact_Number` varchar(20) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `City` varchar(50) NOT NULL,
  `Province` varchar(50) NOT NULL,
  `Zip_Code` varchar(10) NOT NULL,
  `Created_At` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`Patient_ID`, `Category`, `First_Name`, `Middle_Name`, `Last_Name`, `Sex`, `Age`, `Birthdate`, `Civil_Status`, `Religion`, `Nationality`, `Contact_Number`, `Address`, `City`, `Province`, `Zip_Code`, `Created_At`) VALUES
(28, 'student', 'Lynn Czyla ', 'Mercado', 'Alpuerto', 'Female', 20, '2025-05-16', 'Single', 'Catholic ', 'Filipino', '09265566355', '5 Javier St.', 'Pasig City', 'Rizal', '1920', '2025-05-17 17:47:39'),
(29, 'student', 'Marlon  ', 'Mercado', 'Remudo', 'Female', 20, '2025-05-14', 'Single', 'Catholic ', 'Filipino', '09265566355', '5 Javier St.', 'Pasig City', 'Rizal', '1920', '2025-05-17 17:52:04'),
(31, 'student', 'Ryvon', 'Arroza', 'Alpuerto', 'Female', 20, '2025-05-07', 'Single', 'Catholic ', 'Filipino', '09265566355', '5 Javier St.', 'Pasig City', 'Rizal', '1920', '2025-05-17 17:58:40');

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
  `Recorded_at` datetime DEFAULT NULL
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
-- Table structure for table `patient_pdfs`
--

CREATE TABLE `patient_pdfs` (
  `Patient_Pdfs_ID` int(11) NOT NULL,
  `Patient_ID` int(11) DEFAULT NULL,
  `pdf_name` varchar(255) DEFAULT NULL,
  `pdf_data` blob DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient_pdfs`
--

INSERT INTO `patient_pdfs` (`Patient_Pdfs_ID`, `Patient_ID`, `pdf_name`, `pdf_data`, `created_at`) VALUES
(9, 28, 'medical_record_1747475259.pdf', 0x75ab5a6a9a6589c6ad8a89ffa5d7df8a57a76a67a07a77ab6ad79da5d7db6ac7bae095411118b4c4b8cc2896eb7eb38028cc80c081bd89a828f0f0bd51e5c19480bd41859d9428bd4185c995b9d080c480c0814828bd4995cdbdd5c98d95cc80c880c0814828bd359591a58509bde0816cc080c080d4e4d4b8c8dce4e4e4e4e4e4e4e4e4e4e4dcc8dc80e0d0c4b8e0e0e4e4e4e4e4e4e4e4e4e4e4e0d8d17428bd0dbdb9d195b9d1cc80d080c0814828f8f82995b991bd89a828d080c081bd89a828f0f028bd3195b99dd1a080c4ccd828f8f829cdd1c99585b428c0b8d4d8dcc0c0c0c0c0c0c0c0c0c0c0c0c481dc28c0811c29095028bd18c480c4d881519828c4e0b8cce4e4e4e4e4e4e4e4e4e4e4e4e4e0d881513028c0819c28c8e0b8ccd0d8d0d4d8d8e4c8e4c4cccce0e0e080e0c4ccb8d4d0ccd4d0ccccc0dcc0e0d8d4d8d4d881519028a115e185b5c1b19481411118818dbdb9d195b9d0a48151a82915502995b991cdd1c99585b42995b991bd89a828c480c081bd89a828f0f0bd51e5c19480bd41859d95cc28bd2da591cc816ccc80c08148817428bd0dbdd5b9d080c428f8f82995b991bd89a828d480c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd2195b1d995d1a58d8428bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828d880c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd2195b1d995d1a58d84b509bdb19028bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828dc80c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd2195b1d995d1a58d84b53d89b1a5c5d59428bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828e080c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd2195b1d995d1a58d84b509bdb1913d89b1a5c5d59428bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828e480c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd0dbdd5c9a595c828bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4c080c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd0dbdd5c9a595c8b509bdb19028bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4c480c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd0dbdd5c9a595c8b53d89b1a5c5d59428bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4c880c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd0dbdd5c9a595c8b509bdb1913d89b1a5c5d59428bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4cc80c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd51a5b595ccb549bdb585b828bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4d080c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd51a5b595ccb509bdb19028bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4d480c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd51a5b595ccb525d185b1a58c28bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4d880c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd51a5b595ccb509bdb19125d185b1a58c28bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4dc80c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd6985c19911a5b99d8985d1cc28bd4dd589d1e5c19480bd51e5c194c428bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4e080c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd4de5b589bdb028bd4dd589d1e5c19480bd51e5c194c428bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c880c081bd89a828f0f028bd41c9bd8d4d95d0816cbd41111880bd5195e1d080bd25b5859d950880bd25b5859d950c80bd25b5859d95257428bd19bdb9d080f0f028bd18c480d480c0814828bd18c880d880c0814828bd18cc80dc80c0814828bd18d080e080c0814828bd18d480e480c0814828bd18d880c4c080c0814828bd18dc80c4c480c0814828bd18e080c4c880c0814828bd18e480c4cc80c0814828bd18c4c080c4d080c0814828bd18c4c480c4d480c0814828bd18c4c880c4d880c0814828bd18c4cc80c4dc80c0814828bd18c4d080c4e080c0814828f8f828bd613d89a9958dd080f0f028f8f828f8f82995b991bd89a828c4e480c081bd89a828f0f028bd41c9bd91d58d95c880a1a9cd41111880c8b8d4b8c4a428bd0dc99585d1a5bdb91185d19480a110e8c8c0c8d4c0d4c4dcc4dcd0dccce4acc0e09cc0c09ca428f8f82995b991bd89a828c8c080c081bd89a828f0f028bd51e5c19480bd0d85d185b1bd9c28bd41859d95cc80c480c0814828bd3dc195b9058dd1a5bdb8816ccc80c0814880bd19a5d12081b9d5b1b17428bd41859d953185e5bdd5d080bd3db9950dbdb1d5b5b828f8f82995b991bd89a829e1c9959828c080c8c428c0c0c0c0c0c0c0c0c0c080d8d4d4ccd481988028c0c0c0c0c0c0c0cccce480c0c0c0c0c081b88028c0c0c0c0c0c0c8c4d4d880c0c0c0c0c081b88028c0c0c0c0c0c0c0c0c4d480c0c0c0c0c081b88028c0c0c0c0c0c0c0c4d4c880c0c0c0c0c081b88028c0c0c0c0c0c0c0cce4d880c0c0c0c0c081b88028c0c0c0c0c0c0c0d4c8c480c0c0c0c0c081b88028c0c0c0c0c0c0c0d8d4c480c0c0c0c0c081b88028c0c0c0c0c0c0c0dce0d080c0c0c0c0c081b88028c0c0c0c0c0c0c0e4c8c480c0c0c0c0c081b88028c0c0c0c0c0c0c4c0d0d080c0c0c0c0c081b88028c0c0c0c0c0c0c4c4dccc80c0c0c0c0c081b88028c0c0c0c0c0c0c4ccc0d480c0c0c0c0c081b88028c0c0c0c0c0c0c4d0d0c480c0c0c0c0c081b88028c0c0c0c0c0c0c4d4d8e480c0c0c0c0c081b88028c0c0c0c0c0c0c4d8e4d880c0c0c0c0c081b88028c0c0c0c0c0c0c4e0c8d480c0c0c0c0c081b88028c0c0c0c0c0c0c4e4d4e080c0c0c0c0c081b88028c0c0c0c0c0c0c8c0d8c080c0c0c0c0c081b88028c0c0c0c0c0c0c8d0c0d080c0c0c0c0c081b88028c0c0c0c0c0c0c8d0e4c080c0c0c0c0c081b88029d1c985a5b195c828f0f028bd4da5e99480c8c428bd49bdbdd080c8c080c0814828bd25b999bc80c4e480c0814828bd2510816c80f0dd18e4c0d8c8c0c518cd14ccc4c0d91914c4d8d8e11914cd1918e50cd904c118f880f0dd18e4c0d8c8c0c518cd14ccc4c0d91914c4d8d8e11914cd1918e50cd904c118f8817428f8f829cdd185c9d1e1c9959828c8d4e4d0289495153d, '2025-05-17 09:47:39'),
(10, 29, 'medical_record_1747475524.pdf', 0x75ab5a6a9a6589c6ad8a89ffa5d7df8a57a76a67a07a77ab6ad79da5d7db6ac7bae095411118b4c4b8cc2896eb7eb38028cc80c081bd89a828f0f0bd51e5c19480bd41859d9428bd4185c995b9d080c480c0814828bd4995cdbdd5c98d95cc80c880c0814828bd359591a58509bde0816cc080c080d4e4d4b8c8dce4e4e4e4e4e4e4e4e4e4e4dcc8dc80e0d0c4b8e0e0e4e4e4e4e4e4e4e4e4e4e4e0d8d17428bd0dbdb9d195b9d1cc80d080c0814828f8f82995b991bd89a828d080c081bd89a828f0f028bd3195b99dd1a080c4ccd828f8f829cdd1c99585b428c0b8d4d8dcc0c0c0c0c0c0c0c0c0c0c0c0c481dc28c0811c29095028bd18c480c4d881519828c4e0b8cce4e4e4e4e4e4e4e4e4e4e4e4e4e0d881513028c0819c28c8e0b8ccd0d8d0d4d8d8e4c8e4c4cccce0e0e080e0c4ccb8d4d0ccd4d0ccccc0dcc0e0d8d4d8d4d881519028a115e185b5c1b19481411118818dbdb9d195b9d0a48151a82915502995b991cdd1c99585b42995b991bd89a828c480c081bd89a828f0f0bd51e5c19480bd41859d95cc28bd2da591cc816ccc80c08148817428bd0dbdd5b9d080c428f8f82995b991bd89a828d480c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd2195b1d995d1a58d8428bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828d880c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd2195b1d995d1a58d84b509bdb19028bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828dc80c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd2195b1d995d1a58d84b53d89b1a5c5d59428bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828e080c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd2195b1d995d1a58d84b509bdb1913d89b1a5c5d59428bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828e480c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd0dbdd5c9a595c828bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4c080c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd0dbdd5c9a595c8b509bdb19028bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4c480c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd0dbdd5c9a595c8b53d89b1a5c5d59428bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4c880c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd0dbdd5c9a595c8b509bdb1913d89b1a5c5d59428bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4cc80c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd51a5b595ccb549bdb585b828bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4d080c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd51a5b595ccb509bdb19028bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4d480c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd51a5b595ccb525d185b1a58c28bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4d880c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd51a5b595ccb509bdb19125d185b1a58c28bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4dc80c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd6985c19911a5b99d8985d1cc28bd4dd589d1e5c19480bd51e5c194c428bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4e080c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd4de5b589bdb028bd4dd589d1e5c19480bd51e5c194c428bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c880c081bd89a828f0f028bd41c9bd8d4d95d0816cbd41111880bd5195e1d080bd25b5859d950880bd25b5859d950c80bd25b5859d95257428bd19bdb9d080f0f028bd18c480d480c0814828bd18c880d880c0814828bd18cc80dc80c0814828bd18d080e080c0814828bd18d480e480c0814828bd18d880c4c080c0814828bd18dc80c4c480c0814828bd18e080c4c880c0814828bd18e480c4cc80c0814828bd18c4c080c4d080c0814828bd18c4c480c4d480c0814828bd18c4c880c4d880c0814828bd18c4cc80c4dc80c0814828bd18c4d080c4e080c0814828f8f828bd613d89a9958dd080f0f028f8f828f8f82995b991bd89a828c4e480c081bd89a828f0f028bd41c9bd91d58d95c880a1a9cd41111880c8b8d4b8c4a428bd0dc99585d1a5bdb91185d19480a110e8c8c0c8d4c0d4c4dcc4dcd4c8c0d0acc0e09cc0c09ca428f8f82995b991bd89a828c8c080c081bd89a828f0f028bd51e5c19480bd0d85d185b1bd9c28bd41859d95cc80c480c0814828bd3dc195b9058dd1a5bdb8816ccc80c0814880bd19a5d12081b9d5b1b17428bd41859d953185e5bdd5d080bd3db9950dbdb1d5b5b828f8f82995b991bd89a829e1c9959828c080c8c428c0c0c0c0c0c0c0c0c0c080d8d4d4ccd481988028c0c0c0c0c0c0c0cccce480c0c0c0c0c081b88028c0c0c0c0c0c0c8c4d4d880c0c0c0c0c081b88028c0c0c0c0c0c0c0c0c4d480c0c0c0c0c081b88028c0c0c0c0c0c0c0c4d4c880c0c0c0c0c081b88028c0c0c0c0c0c0c0cce4d880c0c0c0c0c081b88028c0c0c0c0c0c0c0d4c8c480c0c0c0c0c081b88028c0c0c0c0c0c0c0d8d4c480c0c0c0c0c081b88028c0c0c0c0c0c0c0dce0d080c0c0c0c0c081b88028c0c0c0c0c0c0c0e4c8c480c0c0c0c0c081b88028c0c0c0c0c0c0c4c0d0d080c0c0c0c0c081b88028c0c0c0c0c0c0c4c4dccc80c0c0c0c0c081b88028c0c0c0c0c0c0c4ccc0d480c0c0c0c0c081b88028c0c0c0c0c0c0c4d0d0c480c0c0c0c0c081b88028c0c0c0c0c0c0c4d4d8e480c0c0c0c0c081b88028c0c0c0c0c0c0c4d8e4d880c0c0c0c0c081b88028c0c0c0c0c0c0c4e0c8d480c0c0c0c0c081b88028c0c0c0c0c0c0c4e4d4e080c0c0c0c0c081b88028c0c0c0c0c0c0c8c0d8c080c0c0c0c0c081b88028c0c0c0c0c0c0c8d0c0d080c0c0c0c0c081b88028c0c0c0c0c0c0c8d0e4c080c0c0c0c0c081b88029d1c985a5b195c828f0f028bd4da5e99480c8c428bd49bdbdd080c8c080c0814828bd25b999bc80c4e480c0814828bd2510816c80f0c90cc114dcd8e10cccc0ccccd4dd1110c0c0d0c518e4d0cce4c8d508cd14c4c8f880f0c90cc114dcd8e10cccc0ccccd4dd1110c0c0d0c518e4d0cce4c8d508cd14c4c8f8817428f8f829cdd185c9d1e1c9959828c8d4e4d0289495153d, '2025-05-17 09:52:04'),
(11, 31, 'medical_record_1747475920.pdf', 0x75ab5a6a9a6589c6ad8a89ffa5d7df8a57a76a67a07a77ab6ad79da5d7db6ac7bae095411118b4c4b8cc2896eb7eb38028cc80c081bd89a828f0f0bd51e5c19480bd41859d9428bd4185c995b9d080c480c0814828bd4995cdbdd5c98d95cc80c880c0814828bd359591a58509bde0816cc080c080d4e4d4b8c8dce4e4e4e4e4e4e4e4e4e4e4dcc8dc80e0d0c4b8e0e0e4e4e4e4e4e4e4e4e4e4e4e0d8d17428bd0dbdb9d195b9d1cc80d080c0814828f8f82995b991bd89a828d080c081bd89a828f0f028bd3195b99dd1a080c4ccd828f8f829cdd1c99585b428c0b8d4d8dcc0c0c0c0c0c0c0c0c0c0c0c0c481dc28c0811c29095028bd18c480c4d881519828c4e0b8cce4e4e4e4e4e4e4e4e4e4e4e4e4e0d881513028c0819c28c8e0b8ccd0d8d0d4d8d8e4c8e4c4cccce0e0e080e0c4ccb8d4d0ccd4d0ccccc0dcc0e0d8d4d8d4d881519028a115e185b5c1b19481411118818dbdb9d195b9d0a48151a82915502995b991cdd1c99585b42995b991bd89a828c480c081bd89a828f0f0bd51e5c19480bd41859d95cc28bd2da591cc816ccc80c08148817428bd0dbdd5b9d080c428f8f82995b991bd89a828d480c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd2195b1d995d1a58d8428bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828d880c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd2195b1d995d1a58d84b509bdb19028bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828dc80c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd2195b1d995d1a58d84b53d89b1a5c5d59428bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828e080c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd2195b1d995d1a58d84b509bdb1913d89b1a5c5d59428bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828e480c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd0dbdd5c9a595c828bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4c080c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd0dbdd5c9a595c8b509bdb19028bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4c480c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd0dbdd5c9a595c8b53d89b1a5c5d59428bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4c880c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd0dbdd5c9a595c8b509bdb1913d89b1a5c5d59428bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4cc80c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd51a5b595ccb549bdb585b828bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4d080c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd51a5b595ccb509bdb19028bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4d480c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd51a5b595ccb525d185b1a58c28bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4d880c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd51a5b595ccb509bdb19125d185b1a58c28bd4dd589d1e5c19480bd51e5c194c428bd15b98dbd91a5b99c80bd5da5b905b9cda515b98dbd91a5b99c28bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4dc80c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd6985c19911a5b99d8985d1cc28bd4dd589d1e5c19480bd51e5c194c428bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c4e080c081bd89a828f0f028bd51e5c19480bd19bdb9d028bd0985cd9519bdb9d080bd4de5b589bdb028bd4dd589d1e5c19480bd51e5c194c428bd19a5c9cdd10da185c880ccc828bd3185cdd10da185c880c8d4d428f8f82995b991bd89a828c880c081bd89a828f0f028bd41c9bd8d4d95d0816cbd41111880bd5195e1d080bd25b5859d950880bd25b5859d950c80bd25b5859d95257428bd19bdb9d080f0f028bd18c480d480c0814828bd18c880d880c0814828bd18cc80dc80c0814828bd18d080e080c0814828bd18d480e480c0814828bd18d880c4c080c0814828bd18dc80c4c480c0814828bd18e080c4c880c0814828bd18e480c4cc80c0814828bd18c4c080c4d080c0814828bd18c4c480c4d480c0814828bd18c4c880c4d880c0814828bd18c4cc80c4dc80c0814828bd18c4d080c4e080c0814828f8f828bd613d89a9958dd080f0f028f8f828f8f82995b991bd89a828c4e480c081bd89a828f0f028bd41c9bd91d58d95c880a1a9cd41111880c8b8d4b8c4a428bd0dc99585d1a5bdb91185d19480a110e8c8c0c8d4c0d4c4dcc4dcd4e0d0c0acc0e09cc0c09ca428f8f82995b991bd89a828c8c080c081bd89a828f0f028bd51e5c19480bd0d85d185b1bd9c28bd41859d95cc80c480c0814828bd3dc195b9058dd1a5bdb8816ccc80c0814880bd19a5d12081b9d5b1b17428bd41859d953185e5bdd5d080bd3db9950dbdb1d5b5b828f8f82995b991bd89a829e1c9959828c080c8c428c0c0c0c0c0c0c0c0c0c080d8d4d4ccd481988028c0c0c0c0c0c0c0cccce480c0c0c0c0c081b88028c0c0c0c0c0c0c8c4d4d880c0c0c0c0c081b88028c0c0c0c0c0c0c0c0c4d480c0c0c0c0c081b88028c0c0c0c0c0c0c0c4d4c880c0c0c0c0c081b88028c0c0c0c0c0c0c0cce4d880c0c0c0c0c081b88028c0c0c0c0c0c0c0d4c8c480c0c0c0c0c081b88028c0c0c0c0c0c0c0d8d4c480c0c0c0c0c081b88028c0c0c0c0c0c0c0dce0d080c0c0c0c0c081b88028c0c0c0c0c0c0c0e4c8c480c0c0c0c0c081b88028c0c0c0c0c0c0c4c0d0d080c0c0c0c0c081b88028c0c0c0c0c0c0c4c4dccc80c0c0c0c0c081b88028c0c0c0c0c0c0c4ccc0d480c0c0c0c0c081b88028c0c0c0c0c0c0c4d0d0c480c0c0c0c0c081b88028c0c0c0c0c0c0c4d4d8e480c0c0c0c0c081b88028c0c0c0c0c0c0c4d8e4d880c0c0c0c0c081b88028c0c0c0c0c0c0c4e0c8d480c0c0c0c0c081b88028c0c0c0c0c0c0c4e4d4e080c0c0c0c0c081b88028c0c0c0c0c0c0c8c0d8c080c0c0c0c0c081b88028c0c0c0c0c0c0c8d0c0d080c0c0c0c0c081b88028c0c0c0c0c0c0c8d0e4c080c0c0c0c0c081b88029d1c985a5b195c828f0f028bd4da5e99480c8c428bd49bdbdd080c8c080c0814828bd25b999bc80c4e480c0814828bd2510816c80f0e4d90cd0d111050510c0d0dd10c8dd0cc10d0cc510d10d051910dcc50cccc90cf880f0e4d90cd0d111050510c0d0dd10c8dd0cc10d0cc510d10d051910dcc50cccc90cf8817428f8f829cdd185c9d1e1c9959828c8d4e4d0289495153d, '2025-05-17 09:58:40');

-- --------------------------------------------------------

--
-- Table structure for table `personnel_patient`
--

CREATE TABLE `personnel_patient` (
  `Personnel_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Department` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `smoking_history`
--

CREATE TABLE `smoking_history` (
  `Smoking_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Usage_Status` varchar(100) DEFAULT NULL,
  `Start_Date` date DEFAULT NULL,
  `Stop_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `smoking_history`
--

INSERT INTO `smoking_history` (`Smoking_ID`, `Patient_ID`, `Usage_Status`, `Start_Date`, `Stop_Date`) VALUES
(24, 28, 'never', NULL, NULL),
(25, 29, 'never', NULL, NULL),
(26, 31, 'never', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `smoking_typeused`
--

CREATE TABLE `smoking_typeused` (
  `SmokingType_ID` int(11) NOT NULL,
  `Smoking_ID` int(11) NOT NULL,
  `Type` varchar(100) DEFAULT NULL,
  `StickperDay` int(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_patient`
--

CREATE TABLE `student_patient` (
  `Student_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Department` varchar(255) NOT NULL,
  `Program` varchar(255) NOT NULL,
  `Batch` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_patient`
--

INSERT INTO `student_patient` (`Student_ID`, `Patient_ID`, `Department`, `Program`, `Batch`) VALUES
(220055, 29, 'CON', 'BSECE', '2023'),
(2300179, 28, 'CON', 'BSCS', '2023'),
(2300895, 31, 'CIHM', 'BSECE', '2023');

-- --------------------------------------------------------

--
-- Table structure for table `surgical_history`
--

CREATE TABLE `surgical_history` (
  `Surgical_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `HasSurgicalHistory` enum('yes','none') NOT NULL,
  `Specify` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `surgical_history`
--

INSERT INTO `surgical_history` (`Surgical_ID`, `Patient_ID`, `HasSurgicalHistory`, `Specify`) VALUES
(24, 28, 'none', NULL),
(25, 29, 'none', NULL),
(26, 31, 'none', NULL);

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
(28, 28, 'user', 'alpuerto_lynnczyla@plpasig.edu.ph', '$2y$10$Gzj.WQ5EzL0F38TbY8VYW.ZF0zyIY7TsJ1rgFeUctR553JROnXu1u'),
(29, 29, 'user', 'remudo_marlon@plpasig.edu.ph', '$2y$10$/2Qt4KTT/UbHlHR5.dv7tOXBovk3O4SfekHOgG.F1KV48QeyDgdnK'),
(31, 31, 'user', 'alpuerto_ryvon@plpasig.edu.ph', '$2y$10$z.ZwjBpQ1uag9cJotKDZ3eW6PXyNe/EImSaUAsGOhq1Zs467HBf46');

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
-- Indexes for table `patient_assessment`
--
ALTER TABLE `patient_assessment`
  ADD PRIMARY KEY (`Assessment_ID`);

--
-- Indexes for table `patient_condition`
--
ALTER TABLE `patient_condition`
  ADD PRIMARY KEY (`PatientCon_ID`),
  ADD KEY `patient_condition_ibfk` (`Patient_ID`);

--
-- Indexes for table `patient_pdfs`
--
ALTER TABLE `patient_pdfs`
  ADD PRIMARY KEY (`Patient_Pdfs_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`);

--
-- Indexes for table `personnel_patient`
--
ALTER TABLE `personnel_patient`
  ADD PRIMARY KEY (`Personnel_ID`),
  ADD UNIQUE KEY `Personnel_ID` (`Personnel_ID`),
  ADD KEY `personnel_patient_ibfk` (`Patient_ID`);

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
  MODIFY `Alcohol_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `borroweditem_records`
--
ALTER TABLE `borroweditem_records`
  MODIFY `BorrowedItem_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `drug_history`
--
ALTER TABLE `drug_history`
  MODIFY `Drug_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `drug_typeused`
--
ALTER TABLE `drug_typeused`
  MODIFY `DrugType_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emergency_contact`
--
ALTER TABLE `emergency_contact`
  MODIFY `EmergencyContact_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `family_history`
--
ALTER TABLE `family_history`
  MODIFY `FamHistory_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `Item_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `maternal`
--
ALTER TABLE `maternal`
  MODIFY `Maternal_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `Patient_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `patient_assessment`
--
ALTER TABLE `patient_assessment`
  MODIFY `Assessment_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patient_condition`
--
ALTER TABLE `patient_condition`
  MODIFY `PatientCon_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `patient_pdfs`
--
ALTER TABLE `patient_pdfs`
  MODIFY `Patient_Pdfs_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `smoking_history`
--
ALTER TABLE `smoking_history`
  MODIFY `Smoking_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `smoking_typeused`
--
ALTER TABLE `smoking_typeused`
  MODIFY `SmokingType_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `surgical_history`
--
ALTER TABLE `surgical_history`
  MODIFY `Surgical_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

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
-- Constraints for table `patient_pdfs`
--
ALTER TABLE `patient_pdfs`
  ADD CONSTRAINT `patient_pdfs_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Constraints for table `visit_records`
--
ALTER TABLE `visit_records`
  ADD CONSTRAINT `visit_records_ibfk` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
