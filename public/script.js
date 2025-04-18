const uploadForm = document.getElementById("uploadForm");
const gallery = document.getElementById("gallery");
const statusMsg = document.getElementById("statusMsg");

const BACKEND_URL = "http://localhost:5002";

uploadForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = new FormData(this); // The this keyword inside the new FormData(this) refers to the form element (<form id="uploadForm"> in your case).When this is passed into the FormData constructor, it tells FormData to gather all the input fields inside that form, including file inputs, and store them in a structured format that can be easily sent to the server.
    // The FormData object allows you to capture all the form field values, including files(which are typically tricky to handle directly without this object).

    try {
        statusMsg.innerText = "Uploading....";

        const res = await fetch(`${BACKEND_URL}/api/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if(data.success) {
            statusMsg.innerText = "Upload Successful";
            this.reset(); // reset the form fields
            await loadMedia(); // refresh gallery
        } else {
            statusMsg.innerText = `Error: ${data.message}`;
        }
    } catch (error) {
        console.log("Upload failed", error);
        statusMsg.innerText = "Upload Failed. please try again.";
    }
});

async function loadMedia() {
    try {
        gallery.innerHTML = "<p>Loading gallery....</p>";

        const res = await fetch(`${BACKEND_URL}/api/upload`);
        const data = await res.json();

        if (data.success) {
            gallery.innerHTML = ""; // clear old content

            data.data.forEach((media) => {
                const deleteButton = `<button onclick="deleteMedia('${media._id}')" style="margin-top: 5px; background-color: red; color: white; padding: 5px; border: none; cursor: pointer;">Delete</button>`;

                const el =
                    media.resource_type === "image"
                        ? `<img src="${media.url}" width="200" />`
                        : media.resource_type === "video"
                            ? `<video src="${media.url}" width="250" controls></video>`
                            : `<a href="${media.url}" target="_blank">${media.url}</a>`;

                gallery.innerHTML += `<div style="margin: 10px;">${el}<br/>${deleteButton}</div>`;
            });
        } else {
            gallery.innerHTML = `<p>Error loading media: ${data.message}</p>`;
        }
    } catch (error) {
        console.error("Error loading media:", error);
        gallery.innerHTML = "<p>Failed to load media. Please try again.</p>";
    }
}

async function deleteMedia (id) {
    const confirmDelete = confirm("Are you sure you want to delete this media?")
    if(!confirmDelete) return;

    try {
        const res = await fetch(`${BACKEND_URL}/api/upload/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();

        if(data.success) {
            alert("Media deleted successfully!")
            await loadMedia(); // reload the gallery
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete media. Please try again.");
    }
}




// async function loadMedia() {
//     try {
//         gallery.innerHTML = "<p>Loading gallery....</p>";
        
//         const res = await fetch(`${BACKEND_URL}/api/upload`);
//         const data = await res.json();

//         if(data.success){
//             gallery.innerHTML = "";

//             data.data.forEach((media) => {
//                 let el;

//                 if(media.resource_type === "imagae") {
//                     el = `<img src="${media.url}" width="200" />`;
//                 } else if(media.resource_type === "video") {
//                     el = `<video src="${media.url}" width="250" controls></video>`;
//                 } else if(media.resource_type === "raw" && media.url.endsWith(".pdf")) {
//                     // handle pdf docs
//                     const fileName = media.url.split("/").pop();
//                     el = `
//                         <div style="display: flex; flex-direction: column; align-items: flex-start;">
//                             <span>📄 <strong>${fileName}</strong></span>
//                             <a href="${media.url}" target="_blank" style="color: blue;">View / Download PDF</a>
//                         </div>
//                     `
//                 } else {
//                     // in case of unknown or unsupported file type
//                     el = `<p>Unsupported file type: ${media.resource_type}</p>`;
//                 }

//                 gallery.innerHTML += `<div style="margin: 10px;">${el}</div>`;
//             });
//         } else {
//             gallery.innerHTML = `<p>Error loading media: ${data.message}</p>`;
//         }
//     } catch (error) {
//         console.error("Error loading media:", error);
//         gallery.innerHTML = "<p>Failed to load media. Please try again.</p>";
//     }
// }


window.onload = loadMedia;

// condition ? value_if_true : value_if_false;
