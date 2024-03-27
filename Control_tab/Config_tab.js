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
});