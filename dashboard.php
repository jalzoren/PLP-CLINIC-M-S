<?php
include 'database.php';

// Query latest visits (today only, optional)
$query = "
    SELECT 
        p.First_Name, p.Middle_Name, p.Last_Name, vr.Time_In
    FROM 
        visit_records vr
    JOIN 
        patient p ON vr.Patient_ID = p.Patient_ID
    WHERE 
        DATE(vr.Time_In) = CURDATE()
    ORDER BY 
        vr.Time_In DESC
";

$result = $mysqli->query($query);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard / PLP Clinic Monitoring System</title>
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="./css/dashbstyle.css">
    <link rel="icon" type="image/png" href="./pictures/logo.png">

</head>
<body>
    <!--   <div class="logo-content">
            <div class="logo" id="logo">
                <img src="./pictures/logo.png" alt="Logo" class="logo-img">
                <div class="logo-name">PLPClinic</div>
            </div>
        </div>

        <ul class="nav-list">
            <li>
                <a href="/forms/dashboard.html" class="active" class="transition-link">
                <i class='bx bxs-grid-alt bx-rotate-180' ></i>
                <span class="link-name">Dashboard</span>
                </a>
                <span class="tooltip">Dashboard</span>
            </li>

            <li>
                <a href="/forms/medrecords.html" class="transition-link">
                <i class='bx bxs-file' ></i>               
                <span class="link-name">Medical</span>
                </a>
                <span class="tooltip">Medical Records</span>
            </li>
            <li>
                <a href="/forms/borrowing.html" class="transition-link">
                <i class='bx bxs-cabinet'></i>
                <span class="link-name">Borrowing</span>
                </a>
                <span class="tooltip">Borrowing Form</span>
            </li>
        
            <li>
                <a href="/forms/transac.html" class="transition-link">
                <i class='bx bxs-info-square' ></i>
                <span class="link-name">Transactions</span>
                </a>
                <span class="tooltip">Daily Transaction</span>
            </li>
            <li>
                <a href="/forms/medinv.html" class="transition-link">
                <i class='bx bxs-capsule' ></i>
                <span class="link-name">Inventory</span>
                </a>
                <span class="tooltip">Medicine Inventory</span>
            </li>
            
        </ul>
        <ul>
        <li class="log-out">
            <br />
          <br />
          <br />
          <br /> 
          <br />
            
            <a href="#">
            <i class='bx bx-log-out bx-rotate-180' ></i>
            <span class="link-name">Logout</span>
            </a>
        </li>
    </ul>
    </div>

    <div class="home-content">
        <img src="pictures/clinic.png" class="clinic">

        <div class="desk">
            <img src="pictures/nurse.png" class="nurse">
            <div class="greetings">
                <h2 class="welcome">Welcome to PLP Clinic Monitoring System</h2>
                <div class="date" id="date"></div>
                <p class="time" id="time"></p>
            </div> 
        </div>

        <a href="#" class="hotlines" onclick="openForm()">
            PASIG CITY EMERGENCY HOTLINES
        </a>

        <div class="data_summary">
            <div class="left_summary">
                <div class="borrower_summary">
                    <div class="bs_title">
                        <p>Borrowed Item Summary</p>
                        <a href="#">See All</a>
                    </div>
                    
                </div>
                <div class="medicine_summary"> 
                    <div class="ms_title">
                        <p>Medicine Summary</p>
                        <a href="#">See All</a>
                    </div>

                </div>
            </div>
            <div class="visits_summary">
                <div class="vs_title">
                    <p>Visits Summary</p>
                    <a href="#">See All</a>
                </div>
                <div class="timedin_table">
                <table>
                    <caption>Currently Timed In</caption>
                    <thead>
                        <tr> 
                        <th>Name</th>
                        <th>Time In</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($result && $result->num_rows > 0): ?>
                            <?php while ($row = $result->fetch_assoc()): ?>
                                <tr>
                                    <td><?= htmlspecialchars($row['Last_Name'] . ' ' . $row['First_Name']) ?></td>
                                    <td><?= date("m/d/Y h:i A", strtotime($row['Time_In'])) ?></td>
                                    <td>
                                        <form method="POST" action="time_out.php">
                                            <input type="hidden" name="visit_id" value="<?= $row['Visit_ID'] ?>">
                                            <button class="timedout" type="submit">Time Out</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <tr><td colspan="3">No students currently timed in.</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
                </div>
            </div>
        </div>

        <div id="overlay" class="overlay"></div>
        <div class="hotlines_table" id="hotlines_table_popup">
            <a class="close_hotlines" onclick="closeForm()">x</a>
            <table>
                <caption>PASIG CITY EMERGENCY NUMBERS</caption>
                <thead >
                    <tr>
                        <th>DEPARTMENT</th>
                        <th>CONTACT NUMBER</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Emergency Hotline</td>
                        <td>(02) 8643 0000</td>
                    </tr>
                    <tr>
                        <td>Pasig City Fire Department</td>
                        <td>(02)</td>
                    </tr>
                    <tr>
                        <td>PNP Hotline</td>
                        <td>(02) 8477 7953</td>
                    </tr>
                    <tr>
                        <td>Pasig City Children's Hospital</td>
                        <td>(02) 8643 2222</td>
                    </tr>
                    <tr>
                        <td>Pasig City General Hospital</td>
                        <td>(02) 8643 3333 <br> (02) 8642 7379 <br> (02) 8642 7381 </td>
                    </tr>
                    <tr>
                        <td>National Emergency Hotline</td>
                        <td>911</td>
                    </tr>
                </tbody>
            </table>
       </div>
    </div>


    <script src="/js/time_in.js"></script>                        
    <script src="/js/time.js"></script>
    <script>
        let btn = document.querySelector("#logo");
        let sidebar = document.querySelector(".sidebar");
    
        btn.onclick = function() {
            sidebar.classList.toggle("active");
        }
    </script>

    <script>
        function openForm() {
            document.getElementById("hotlines_table_popup").classList.add("show");
            document.getElementById("overlay").classList.add("show");
        }
    
        function closeForm() {
            document.getElementById("hotlines_table_popup").classList.remove("show");
            document.getElementById("overlay").classList.remove("show");
            
        }
    </script>
</body>
</html>