document.addEventListener("DOMContentLoaded", function () {

   const serButton = document.getElementById("serbutton");
   const userinput = document.getElementById("ser1");
   const statsContainer = document.querySelector(".stats");
   const easyCircle = document.querySelector(".easy-progress");
   const mediumCircle = document.querySelector(".medium-progress");
   const hardCircle = document.querySelector(".hard-progress");
   const easyLable = document.getElementById("easy-Lable");
   const mediumLable = document.getElementById("medium-Lable");
   const hardLable = document.getElementById("hard-Lable");
   const cardStatsContainer = document.querySelector(".stats-cards")

   //return true or false based on a regrx(regular exprassion)
   function validateUsername(username) {
      if (username.trim() === "") {
         alert("User name can't be Empty");
         return false;
      }
      //check if user is valid result matching
      const regex = /^[a-zA-Z0-9_-]{1,15}$/;
      const isMatching = regex.test(username);
      if (!isMatching) {
         alert("!Invalid Username")
      }
      return isMatching;
   }

   async function fetchUserDetails(username) {
      try {
         serButton.textContent = "Searching ...";
         serButton.disabled = true;
         //creating a proxy demo server request
         const proxyUrl = `https://cors-anywhere.herokuapp.com/`
         const targetUrl = `https://leetcode.com/graphql/`;

         //concatinated url :https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql/;

         const myHeaders = new Headers();
         myHeaders.append("content-Type", "application/json");

         const graphql = JSON.stringify({
            query: "\n    query userSessionProgress($username: String!) {\n    allQuestionsCount {\n   difficulty\n  count\n  } \n  matchedUser (username: $username) {\nsubmitStatsGlobal  {\n   acSubmissionNum  {\n   difficulty\n   count\n    submissions\n    }\n    totalSubmissionNum {\n difficulty\n    count\n    submissions\n    }\n}\n}\n}\n   ",
            variables: { username }
         });
         const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: graphql,
            redirect: "follow"
         };

         const response = await fetch(proxyUrl + targetUrl, requestOptions);

         if (!response.ok) {
            throw new Error("Unable to fetch the user details");
         }
         const ParsedData = await response.json();
         console.log("logging data: ", ParsedData);

         displayUserData(ParsedData);
      }
      catch (error) {
         statsContainer.innerHTML = `<p>The data not found</p>`;
      }
      finally {
         serButton.textContent = "Search";
         serButton.disabled = false;
      }
   }

   function updateProgress(solved, total, Lable, circle) {
      const progressDegree = (solved / total) * 100;
      circle.style.setProperty("--progress-degree",`${progressDegree}%`);
      Lable.textContent = `${solved}/${total}`;
   }

   function displayUserData(ParsedData) {
      const totalQues = ParsedData.data.allQuestionsCount[0].count;
      const totalEasyQues = ParsedData.data.allQuestionsCount[1].count;
      const totalMediumQues = ParsedData.data.allQuestionsCount[2].count;
      const totalHardQues = ParsedData.data.allQuestionsCount[3].count;

      const solvedTotalQues = ParsedData.data.matchedUser.submitStatsGlobal.acSubmissionNum[0].count;
      const solvedTotalEasyQues = ParsedData.data.matchedUser.submitStatsGlobal.acSubmissionNum[1].count;
      const solvedTotalMediumQues = ParsedData.data.matchedUser.submitStatsGlobal.acSubmissionNum[2].count;
      const solvedTotalHardQues = ParsedData.data.matchedUser.submitStatsGlobal.acSubmissionNum[3].count;

      updateProgress(solvedTotalEasyQues, totalEasyQues, easyLable, easyCircle);
      updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLable, mediumCircle);
      updateProgress(solvedTotalHardQues, totalHardQues, hardLable, hardCircle);


      const cardData = [
         {Lable: "Overall Submissions" , value:ParsedData.data.    matchedUser.submitStatsGlobal.totalSubmissionNum[0].submissions
         },
         {Lable: "Overall Easy Submissions" , value:ParsedData.data.    matchedUser.submitStatsGlobal.totalSubmissionNum[1].submissions
         },
         {Lable: "Overall Medium Submissions" , value:ParsedData.data.    matchedUser.submitStatsGlobal.totalSubmissionNum[2].submissions
         },
         {Lable: "Overall Hard Submissions" , value:ParsedData.data.    matchedUser.submitStatsGlobal.totalSubmissionNum[3].submissions
         },
      ];
      console.log("card da data:" , cardData)


      cardStatsContainer.innerHTML = cardData.map(
         data =>`
               <div class="cards">
               <h3> ${data.Lable} </h3>
               <p> ${data.value} </p>
               </div>
            `
      ).join("")
   };
   serButton.addEventListener('click', function () {
      const username = userinput.value;
      console.log("loggin succes: ", username);

      if (validateUsername(username)) {
         fetchUserDetails(username)
      };
   });
}) 