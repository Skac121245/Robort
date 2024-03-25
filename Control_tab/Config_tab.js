document.addEventListener('DOMContentLoaded', (event) => {
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
});