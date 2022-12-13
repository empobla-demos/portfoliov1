/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement HTML div element with `drop-zone` class
 * @param {File} file Actual file to be uploaded
 */
function updateThumbnail(dropZoneElement, file) {
    //- console.log(dropZoneElement);
    //- console.log(file);
    let thumbnailElement = dropZoneElement.querySelector('.drop-zone__thumb');

    // First time - remove the prompt
    if(dropZoneElement.querySelector('.drop-zone__prompt')) dropZoneElement.querySelector('.drop-zone__prompt').remove();

    // First time  - there is no thumbnail element, so create it
    if (!thumbnailElement) {
        thumbnailElement = document.createElement('div');
        thumbnailElement.classList.add('drop-zone__thumb');
        dropZoneElement.appendChild(thumbnailElement);
    }

    thumbnailElement.dataset.label = file.name;

    // Show thumbnail for image files
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
            thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
        };
    } else {
        thumbnailElement.style.backgroundImage = null;
    }
};

/**
 * Sets up drop-zone elements. These elements must be structured as follows:
 * ```html
 * <div class="drop-zone">
 *  <span class="drop-zone__prompt">Drop file here or click to upload</span>
 *  <input class="drop-zone__input" type="file" name="<name>" />
 * </div>
 * ```
 * On file upload, the function updates the structure to display as follows:
 * ```html
 * <div class="drop-zone">
 *  <div class="drop-zone__thumb" data-label="imageName.txt"> </div>
 *  <input class="drop-zone__input" type="file" name="<name>" />
 * </div>
 * ```
 */
function dropZoneSetup() {
    document.querySelectorAll('.drop-zone__input').forEach(inputElement => {
        const dropZoneElement = inputElement.closest(".drop-zone");

        // Click to Upload
        dropZoneElement.addEventListener('click', e => inputElement.click());

        inputElement.addEventListener('change', e => {
            if(inputElement.files.length == 1) {
                updateThumbnail(dropZoneElement, inputElement.files[0]);
            }
        });

        // Change dashed line to solid line and back
        dropZoneElement.addEventListener('dragover', e => {
            e.preventDefault();
            dropZoneElement.classList.add('drop-zone--over');
        });

        ['dragleave', 'dragend'].forEach(type => {
            dropZoneElement.addEventListener(type, e => {
                dropZoneElement.classList.remove('drop-zone--over');
            });
        });

        // Drop to Upload
        dropZoneElement.addEventListener('drop', e => {
            e.preventDefault();
            //- console.log(e.dataTransfer.files);
            if (e.dataTransfer.files.length) {
                inputElement.files = e.dataTransfer.files;
                updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
            }

            dropZoneElement.classList.remove('drop-zone--over');
        });
    });
};

/**
 * Shows project delete modal and handles functionality.
 * 
 * @param {String} id String specifies project to be deleted's Object _id
 * @param {String} name String specifies project to be deleted's name
 */
function deleteModal(id, name, type) {
    const modalBg = document.querySelector('.modal-bg');
    const modal = document.getElementById('modal--delete');
    const projectName = document.getElementById('js-delete--projectname');
    const buttonConfirm = document.getElementById('js-delete--confirm');

    modalBg.style.display = 'block';
    modal.style.display = 'flex';
    projectName.innerHTML = name;
    buttonConfirm.href = `/admin/${type}/delete/${id}`;

    function closeModal(modal, projectName, modalBg, buttonConfirm) {
        modal.style.display = 'none';
        buttonConfirm.href = '';
        projectName.innerHTML = 'project';
        modalBg.style.display = 'none';
    };

    function clickOutside(e) {
        if (e.target.matches('#js-delete--cancel') || !e.target.closest('#modal--delete')) {
            closeModal(modal, projectName, modalBg, buttonConfirm);
            modalBg.removeEventListener('click', clickOutside);
        }
    }

    modalBg.addEventListener('click', clickOutside);

    document.addEventListener('keydown', e => {
        if (e.keyCode === 27) closeModal(modal, projectName, modalBg, buttonConfirm);
    }, { once: true });
};

/**
 * Shows custom styles modal and handles functionality.
 */
function customStylesModal() {
    const modalBg = document.querySelector('.modal-bg');
    const modal = document.getElementById('modal--custom-styles');
    
    modalBg.style.display = 'block';
    modal.style.display = 'flex';

    function closeModal(modal, modalBg) {
        modal.style.display = 'none';
        modalBg.style.display = 'none';
    };

    function clickOutside(e) {
        if (!e.target.closest('#modal--custom-styles')) { 
            closeModal(modal, modalBg);
            modalBg.removeEventListener('click', clickOutside);
        }
    }
    
    modalBg.addEventListener('click', clickOutside);

    document.addEventListener('keydown', e => {
        if (e.keyCode === 27) closeModal(modal, modalBg);
    }, { once: true });
};

/**
 * Sets up carousel. Carousels must be structured as follows:
 * ```html
 * <div class="portfolio-carousel">
 *  <div class="portfolio-carousel__pages">
 *    <div class="portfolio-carousel__page portfolio-carousel__page--first">
 *      <a class=".carousel-item">
 *        <img class="carousel-item__bg" />
 *        <div class="carousel-item__label" id="sidequest--itemlabel">
 *          <h3 class="carousel-item__name">...</h3>
 *        </div>
 *        <div class="carousel-item__logo">
 *          <img />
 *        </div>
 *      </a>
 *      ...
 *    </div>
 *    <div class="portfolio-carousel__page portfolio-carousel__page--first">
 *      ...
 *    </div>
 *    <div class="portfolio-carousel__navigation">
 *      <label for='radio0' class='manual-btn'></label>
 *      ...
 *    </div>
 *  </div>
 * </div>
 * ```
 */
function setupCarousel() {
    const radioBtns = document.querySelectorAll('.manual-btn');
    const firstPage = document.querySelector('.portfolio-carousel__page--first');
    radioBtns.forEach(button => {
        button.addEventListener('click', () => {
            const clickedBtnNumber = button.htmlFor.substring(5);
            const moveLeftBy = clickedBtnNumber * -20;
            firstPage.style.cssText = `margin-left: ${moveLeftBy}%;`;

            radioBtns.forEach(radioBtn => radioBtn.style.backgroundColor = 'transparent');
            button.style.backgroundColor = 'var(--border-color)';
        });
    });
};
