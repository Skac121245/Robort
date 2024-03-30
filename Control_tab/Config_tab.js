document.addEventListener('DOMContentLoaded', (event) => {
    let checklistItems = []
    const eventCodeForm = document.getElementById('eventCodeForm');
    const form = document.getElementById('teamForm');

    eventCodeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const eventCode = document.getElementById('eventCode').value;
        localStorage.setItem('eventCode', eventCode); 

});
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the form from submitting in the traditional way
        const teamNumber = document.getElementById('teamNumber').value;
        const dim_w_bump = document.getElementById('dim_w_bump').value;
        const dim_wout_bump = document.getElementById('dim_wout_bump').value;
        const drive_train = document.getElementById('drive_train').value;
        const weight = document.getElementById('weight').value;
      

        localStorage.setItem('teamNumber', teamNumber); 
        localStorage.setItem('dim_w_bump', dim_w_bump); 
        localStorage.setItem('dim_wout_bump', dim_wout_bump); 
        localStorage.setItem('drive_train', drive_train); 
        localStorage.setItem('weight', weight); 
       
        document.querySelectorAll('.checkboxes input[type="checkbox"]').forEach(checkbox => {
            localStorage.setItem(checkbox.name, checkbox.checked);
        });

        
    });

    teleopForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const ground = document.getElementById('ground').value;
        localStorage.setItem('ground', ground);
        const source = document.getElementById('source').value;
        localStorage.setItem('source', source);
        const speaker = document.getElementById('speaker').value;
        localStorage.setItem('speaker', speaker);
        const distance_shoot = document.getElementById('distance_shoot').value;
        localStorage.setItem('distance_shoot', distance_shoot);
        const amp = document.getElementById('amp').value;
        localStorage.setItem('amp', amp);
});

autoNamesForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const newItemsInput = document.getElementById('newItems');
    const newItems = newItemsInput.value.split(' '); // Split input by spaces
    checklistItems = checklistItems.concat(newItems); // Add new items to the global checklist items array
   localStorage.setItem('autoNames', newItems)
    newItemsInput.value = ''; // Clear the input field
});

endGameForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const climb = document.getElementById('climb').value
 localStorage.setItem('climb', climb)
 const harmony = document.getElementById('harmony').value
 localStorage.setItem('harmony', harmony)
});

document.getElementById('addAutoName').addEventListener('click', function () {
    const container = document.getElementById('autoNamesContainer');
    const uniqueId = Date.now(); // Create a unique ID for matching label with input
    const itemDiv = document.createElement('div');
    itemDiv.className = 'autoItem';
    itemDiv.innerHTML = `
      <input type="text" placeholder="Auto Name" name="autoNames[]">
      <input type="file" accept="image/*" name="autoImages[]" id="file-${uniqueId}" style="display: none;">
      <label for="file-${uniqueId}" style="cursor: pointer;">Upload Image</label>
      <img id="preview-${uniqueId}" style="display: none;" width="100" /> <!-- Placeholder for image preview -->
  `;
    container.appendChild(itemDiv);

    // Add a change listener to this file input for image preview
    document.getElementById(`file-${uniqueId}`).addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const imgElement = document.getElementById(`preview-${uniqueId}`);
          imgElement.src = e.target.result;
          imgElement.style.display = 'block'; // Show image preview
        };
        reader.readAsDataURL(file);
      }
    });
  });

  document.getElementById('autoNamesForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const autoNamesInputs = document.querySelectorAll('input[type="text"][name="autoNames[]"]');
    const autoImagesInputs = document.querySelectorAll('input[type="file"][name="autoImages[]"]');
    const autos = [];

    // Assuming each auto name has a corresponding image input
    autoNamesInputs.forEach((input, index) => {
      const file = autoImagesInputs[index].files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = function () {
          // Once file is loaded, save auto name and image as Base64 string
          autos.push({ name: input.value, image: reader.result });
          // Check if all files have been processed then save to localStorage
          if (autos.length === autoNamesInputs.length) {
            localStorage.setItem('autos', JSON.stringify(autos));
            alert('Auto names and images saved to localStorage.');
          }
        };
        reader.readAsDataURL(file);
      } else {
        // If no file was selected, still save the name with a placeholder for the image
        autos.push({ name: input.value, image: '' });
        if (autos.length === autoNamesInputs.length) {
          localStorage.setItem('autos', JSON.stringify(autos));
          alert('Auto names and images saved to localStorage.');
        }
      }
    });
  });
});