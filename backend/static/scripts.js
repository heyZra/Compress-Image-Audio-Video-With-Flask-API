document.addEventListener('DOMContentLoaded', function() {
    // Function to handle file input change
    document.getElementById('file').addEventListener('change', function() {
        const fileInput = this;
        const fileNameSpan = document.getElementById('file-name');
        const removeButton = document.getElementById('remove-file');

        if (fileInput.files.length > 0) {
            fileNameSpan.textContent = fileInput.files[0].name;
            removeButton.style.display = 'inline-block';
        } else {
            fileNameSpan.textContent = 'No file chosen';
            removeButton.style.display = 'none';
        }
    });

    // Function to remove the selected file
    window.removeFile = function() {
        const fileInput = document.getElementById('file');
        const fileNameSpan = document.getElementById('file-name');
        const removeButton = document.getElementById('remove-file');

        fileInput.value = ''; // Clear the file input
        fileNameSpan.textContent = 'No file chosen';
        removeButton.style.display = 'none';
    };
});
