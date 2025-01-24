var mySidebar = document.getElementById("mySidebar");
var overlayBg = document.getElementById("myOverlay");

function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
    overlayBg.style.display = "none";
  } else {
    mySidebar.style.display = 'block';
    overlayBg.style.display = "block";
  }
}

function w3_close() {
  mySidebar.style.display = "none";
  overlayBg.style.display = "none";
}

function showContent(sectionId) {
  const sections = document.querySelectorAll('.w3-container');
  sections.forEach(section => section.classList.add('hidden'));

  const buttons = document.querySelectorAll('.w3-bar-item');
  buttons.forEach(button => button.classList.remove('active'));

  const selectedSection = document.getElementById(sectionId);
  selectedSection.classList.remove('hidden');

  const selectedButton = document.querySelector(`a[onclick="showContent('${sectionId}')"]`);
  selectedButton.classList.add('active');

  if (sectionId === 'admin-page') {
    mySidebar.innerHTML = ''; 
    renderAdminTopMenu();
  } else {
    const pageName = selectedSection.getAttribute('data-name');
    const container = selectedSection.querySelector('.container'); 
    const menuLeftItems = Array.from(container.children).filter(child => child.id);
    
    let sidebarContent = `<h4 class="w3-bar-item"><b>${pageName}</b></h4>`;
    
    menuLeftItems.forEach((element) => {
      const itemName = element.getAttribute('data-name');
      sidebarContent += `<a class="w3-bar-item w3-button w3-hover-black" href="#${element.id}">${itemName}</a>`;
    });

    mySidebar.innerHTML = sidebarContent; 
  }

  inputAddedMenuTop = false; 
  inputAddedMenuLeft=false;
  inputAddedContentsLayout = false; 
}

window.onload = function () {
  showContent('courseInfo');
};


//=============================================Menu page===========================================================
const adminPage = document.getElementById('admin-page');
//=================================================================================================================
//========================Admin menu top===========================================================================
//=================================================================================================================
const contentContainer = document.getElementById('content-container');
let menuTopItems;

function renderAdminTopMenu() {
  menuTopItems = Array.from(contentContainer.children).filter(child => child.id && child.id !== 'admin-page');
  let adminContent = `
  <div>Admin menu top: Chỉnh sửa menu top</div>
  <div class="page-list-container">
    <ul id="pageList">`;
    menuTopItems.forEach((item) => {
      adminContent += `
        <li style="display: flex; align-items: center; justify-content: space-between;">
          <span class="page-name" data-id="${item.id}">${getName(item.id)}</span> 
          <div class="icon-container">
            <button class="icon-button icon-view" onclick="displayMenuLeft('${item.id}')">
              <i class="fas fa-eye"></i>
            </button>
            ${item.id !== 'courseInfo' ? `
              <button class="icon-button icon-edit" onclick="editMenuTop('${item.id}')">
                <i class="fas fa-edit"></i>
              </button>
              <button class="icon-button icon-remove" onclick="removeMenuTop('${item.id}')">
                <i class="fas fa-times"></i>
              </button>
            ` : `
              <button class="icon-button" style="visibility: hidden;"></button>
              <button class="icon-button" style="visibility: hidden;"></button>
            `}
            <button class="icon-button icon-add" onclick="showNewMenuTopInput(this.parentNode.parentNode, '${item.id}')">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </li>
        <hr style="margin: 5px 0;"/>
      `;
    });

  adminContent += `
      </ul>
    </div>
  `;
  adminPage.innerHTML = adminContent;
}
//======================================================================
//==================================Add=================================
let inputAddedMenuTop = false; 

function showNewMenuTopInput(element, pageId) {
  if (inputAddedMenuTop) return;

  const htmlContent = `
    <hr style="margin: 5px 0;"/>
    <li class="new-content">
      <input type="text" id="new-menu-top-input-${pageId}" placeholder="Nhập tên menu top" />
      <button onclick="createMenuTop(this,'${pageId}')">Submit</button>
    </li>
  `;

  element.insertAdjacentHTML('afterend', htmlContent);
  inputAddedMenuTop = true;
}

function createMenuTop(button,pageId) {
  const pageElement = document.getElementById(pageId);
  const inputElement = button.previousElementSibling; 
  const pageName = inputElement.value.trim(); 

  if (pageName === "") {
    alert("Vui lòng nhập tên trang."); 
    return;
  }

  const newId = generateIdFromVietnameseText(pageName);
  const newContent = `
     <div id="${newId}" data-name="${pageName}" class="w3-container w3-padding-64 hidden">
      <div class="container">
        <div id="default-content-${newId}" data-name="default content"/>
      </div>
    </div>
  `;

  pageElement.insertAdjacentHTML("afterend", newContent);
  menuTopItems = Array.from(contentContainer.children).filter(child => child.id && child.id !== 'admin-page');
  renderAdminTopMenu();
  inputAddedMenuTop = false;
  renderNavbar();
}
//======================================================================
//================================Delete================================
function removeMenuTop(pageId) {
  const pageElement = document.getElementById(pageId);
  if (pageElement) {
    pageElement.remove();
    renderAdminTopMenu();
    renderNavbar();
  } else {
    console.error(`Không tìm thấy phần tử với ID ${pageId}.`);
  }
}
//======================================================================
//=================================Edit=================================
function editMenuTop(pageId) {
  const pageNameElement = document.querySelector(`.page-name[data-id="${pageId}"]`);
  if (pageNameElement.querySelector('input')) {
    return; 
  }
  const currentName = pageNameElement.textContent;
  pageNameElement.innerHTML = `
    <input type="text" id="page-input-${pageId}" value="${currentName}" />
    <button onclick="updateMenuTop('${pageId}')">Lưu</button>
    <button onclick="cancelPageEdit('${pageId}', '${currentName}')">Hủy</button>
  `;
  document.getElementById(`page-input-${pageId}`).focus();
}

function updateMenuTop(pageId) {
  const input = document.getElementById(`page-input-${pageId}`);
  const newName = input.value.trim();
  if (newName) {
    const pageElement = document.getElementById(pageId); 
    pageElement.setAttribute('data-name', newName); 
    renderNavbar();
    renderAdminTopMenu();
  } else {
    alert("Tên trang không được để trống!");
  }
}

function cancelPageEdit(pageId, originalName) {
  const pageNameElement = document.querySelector(`.page-name[data-id="${pageId}"]`);
  pageNameElement.innerHTML = originalName;  
}
//======================================================================
//=================================View=================================
function displayMenuLeft(pageId) {
  selectedMenuLeft=pageId;
  renderAdminLeftMenu(); 
  renderSidebar(pageId);
}

//==================================================================================================================
//========================Admin menu left===========================================================================
//==================================================================================================================
let menuLeftItems;
let selectedMenuLeft = null;

function renderAdminLeftMenu() {
  const pageElement = document.getElementById(selectedMenuLeft);
  const container = pageElement.querySelector('.container');
  menuLeftItems = Array.from(container.children).filter(child => child.id);

  let adminContent = `
    <div>Admin menu left: "${getName(selectedMenuLeft)}"</div>
    <div class="page-list-container">
      <ul id="pageList">`;

  if (menuLeftItems.length === 0) {
    adminContent += `
      <li style="text-align: center; margin: 10px 0;">
        <button class="icon-button icon-add" onclick="addFirstMenuLeft()">
          <i class="fas fa-plus"></i> Thêm mới
        </button>
      </li>`;
  } else {
    menuLeftItems.forEach((item) => {
      adminContent += `
        <li style="display: flex; align-items: center; justify-content: space-between;">
          <span class="page-name" data-id="${item.id}">${getName(item.id)}</span> 
          <div class="icon-container">
            <button class="icon-button icon-view" onclick="displayMenuLeftslayout('${item.id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="icon-button icon-edit" onclick="editMenuLeft('${item.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="icon-button icon-remove" onclick="removeMenuLeft('${item.id}')">
              <i class="fas fa-times"></i>
            </button>
            <button class="icon-button icon-add" onclick="showMenuLeftInput(this.parentNode.parentNode, '${item.id}')">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </li>
        <hr style="margin: 5px 0;"/>
      `;
    });
  }

  if (selectedMenuLeft === 'student-info') {
    adminContent += `
      <li style="text-align: center; margin: 10px 0;">
        <button class="icon-button icon-reset" onclick="resetStudentInfo()">
          <i class="fas fa-refresh"></i> Reset nội dung
        </button>
      </li>`;
  }

  adminContent += `
      </ul>
    </div>
  `;
  adminPage.innerHTML = adminContent;
}
//======================================================================
//========================Save Student Info=============================
let studentInfoBackup = null;

function saveStudentInfoContent() {
  const studentInfoElement = document.getElementById('student-info');  
  if (studentInfoElement) {
    studentInfoBackup = studentInfoElement.innerHTML;  
  }
}

document.addEventListener('DOMContentLoaded', saveStudentInfoContent);


function resetStudentInfo() {
  if (studentInfoBackup !== null) {
    const studentInfoElement = document.getElementById('student-info');
    if (studentInfoElement) {
      studentInfoElement.innerHTML = studentInfoBackup;  
      renderAdminLeftMenu();
    }
  }
}
//======================================================================
//=============================Add first================================
function addFirstMenuLeft() {
  const pageElement = document.getElementById(selectedMenuLeft);
  const container = pageElement.querySelector('.container');
  const htmlContent = `
  <div id="new-content-${selectedMenuLeft}" data-name="New menu left" class="grid-container" data-name="Khai giảng">
  </div>
`;
container.insertAdjacentHTML('beforeend', htmlContent);
renderAdminLeftMenu();
}
//======================================================================
//==================================Add=================================
let inputAddedMenuLeft = false; 

function showMenuLeftInput(element, pageItemId) {
  if (inputAddedMenuLeft) return;
  const htmlContent = `
    <hr style="margin: 5px 0;"/>
    <li class="new-content">
      <input type="text" id="new-menu-top-input-${selectedMenuLeft}" placeholder="Nhập tên menu left" />
      <button onclick="createMenuLeft(this, '${pageItemId}')">Submit</button>
    </li>
  `;
  element.insertAdjacentHTML('afterend', htmlContent);
  inputAddedMenuLeft = true;
}

function createMenuLeft(button, pageItemId) {
  const pageElement = document.getElementById(pageItemId);
  const inputElement = button.previousElementSibling; 
  const ItemName = inputElement.value.trim(); 
  if (ItemName === "") {
    alert("Vui lòng nhập tên mục."); 
    return;
  }
  const newId = generateIdFromVietnameseText(ItemName);
  const newContent = `
    <div id="${newId}" data-name="${ItemName}" class="grid-container"/>
  `;
  pageElement.insertAdjacentHTML("afterend", newContent);
  inputAddedMenuLeft = false;
  renderAdminLeftMenu();
  renderSidebar();
}
//======================================================================
//================================Delete================================
function removeMenuLeft(pageItemId) {
  const pageElement = document.getElementById(pageItemId);
  if (pageElement) {
    pageElement.remove();
    renderAdminLeftMenu();
    renderSidebar();
  } else {
    console.error(`Không tìm thấy phần tử với ID ${pageItemId}.`);
  }
}
//======================================================================
//=================================Edit=================================
function editMenuLeft(pageId) {
  const pageNameElement = document.querySelector(`.page-name[data-id="${pageId}"]`);
  if (pageNameElement.querySelector('input')) {
    return; 
  }
  const currentName = pageNameElement.textContent;
  pageNameElement.innerHTML = `
    <input type="text" id="page-input-${pageId}" value="${currentName}" />
    <button onclick="updateMenuLeftName('${pageId}')">Lưu</button>
    <button onclick="cancelmenuLeftEdit('${pageId}', '${currentName}')">Hủy</button>
  `;
  
  document.getElementById(`page-input-${pageId}`).focus();
}


function updateMenuLeftName(pageId) {
  const input = document.getElementById(`page-input-${pageId}`);
  const newName = input.value.trim();
  if (newName) {
    const pageElement = document.getElementById(pageId); 
    pageElement.setAttribute('data-name', newName); 
    renderAdminLeftMenu();
    renderSidebar();
  } else {
    alert("Tên trang không được để trống!");
  }
}

function cancelmenuLeftEdit(pageId, originalName) {
  const pageNameElement = document.querySelector(`.page-name[data-id="${pageId}"]`);
  pageNameElement.innerHTML = originalName;  
}
//======================================================================
//=================================View=================================
function displayMenuLeftslayout(pageItemId) {
  selectedAdminContentsLayout = pageItemId;
  renderAdminContentsLayout(); 
  document.querySelectorAll('.w3-bar-item.w3-button').forEach(item => {
    item.classList.remove('active');
  });
  const sidebarItem = document.querySelector(`.w3-bar-item.w3-button[href="#${pageItemId}"]`);
  if (sidebarItem) {
    sidebarItem.classList.add('active');
  }
}
//==================================================================================================================
//=========================Admin contents layout====================================================================
//==================================================================================================================
let listContentsLayout;
let selectedAdminContentsLayout = null;

function renderAdminContentsLayout() {
  const pageElement = document.getElementById(selectedAdminContentsLayout); 
  const listContentsLayout = Array.from(pageElement.children).filter(child => child.id);
  let adminContent = `
    <div>Admin contents layout: "${getName(selectedMenuLeft)}/${getName(selectedAdminContentsLayout)}"</div>
    <div class="page-list-container">
      <ul id="pageList">`;

    if (listContentsLayout.length === 0) {
      adminContent += `
        <li style="text-align: center; margin: 10px 0;">
          <button class="icon-button icon-add" onclick="addFirstContentLayout()">
            <i class="fas fa-plus"></i> Thêm mới
          </button>
        </li>`;
    } else {
      listContentsLayout.forEach((element) => {
        adminContent += `
          <li style="display: flex; align-items: center; justify-content: space-between;">
            <span class="page-name" data-id="${element.id}">${getName(element.id)}</span> 
            <div class="icon-container">
              <button class="icon-button icon-view" onclick="displayAdminContents('${element.id}')">
                <i class="fas fa-eye"></i>
              </button>
              <button class="icon-button icon-edit" onclick="editContentsLayout('${element.id}')">
                <i class="fas fa-edit"></i>
              </button>
              <button class="icon-button icon-remove" onclick="removeContentsLayout('${element.id}')">
                <i class="fas fa-times"></i>
              </button>
              <button class="icon-button icon-add" onclick="showContentsLayoutInput(this.parentNode.parentNode, '${element.id}')">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </li>
          <hr style="margin: 5px 0;"/>
        `;
      });
    }
    
  adminContent += `
      </ul>
    </div>
  `;

  let preview = `
  <div class="preview-container" style="margin-top: 20px;">
    <h3>Preview</h3>
    <div class="grid-container">
`;

  listContentsLayout.forEach((element) => {
    preview += `
      <div style="border: 2px solid #333; padding: 10px; ${element.style.cssText}">
        ${getName(element.id)}
      </div>
    `;
  });

  preview += `
      </div>
    </div>
  `;

  adminContent += preview;

  adminPage.innerHTML = adminContent;
}
//======================================================================
//=============================Add first================================
function addFirstContentLayout() {
  const pageElement = document.getElementById(selectedAdminContentsLayout);
  const htmlContent = `
  <div id="new-content-${selectedAdminContentsLayout}" data-name="New content layout" style="grid-column: span 12;"/>
`;
pageElement.insertAdjacentHTML('beforeend', htmlContent);
renderAdminContentsLayout();
}
//======================================================================
//==================================Add=================================
let inputAddedContentsLayout = false; 

function showContentsLayoutInput(element, pageItemId) {
  if (inputAddedContentsLayout) return;
  const htmlContent = `
    <hr style="margin: 5px 0;"/>
    <li class="new-content">
      <input type="text" id="new-menu-top-input-${pageItemId}" placeholder="Nhập tên content layout" />
      <button onclick="createContentsLayout(this, '${pageItemId}')">Submit</button>
    </li>
  `;
  element.insertAdjacentHTML('afterend', htmlContent);
  inputAddedContentsLayout = true;
}

function createContentsLayout(button, pageItemId) {
  const pageElement = document.getElementById(pageItemId);
  const inputElement = button.previousElementSibling; 
  const ItemName = inputElement.value.trim(); 
  if (ItemName === "") {
    alert("Vui lòng nhập tên mục."); 
    return;
  }
  const newId = generateIdFromVietnameseText(ItemName);
  const newContent = `
    <div id="${newId}" data-name="${ItemName}" style="grid-column: span 12;">
    </div>
  `;
  pageElement.insertAdjacentHTML("afterend", newContent);
  inputAddedContentsLayout = false;
  renderAdminContentsLayout();
}

//======================================================================
//================================Delete================================
function removeContentsLayout(pageItemId) {
  const pageElement = document.getElementById(pageItemId);
  if (pageElement) {
    pageElement.remove();
    renderAdminContentsLayout();
  } else {
    console.error(`Không tìm thấy phần tử với ID ${pageItemId}.`);
  }
}

//======================================================================
//=================================Edit=================================
function editContentsLayout(pageItemId) {
  const element = document.getElementById(pageItemId);
  
  const currentDataName = element.getAttribute("data-name");
  const currentGridColumn = element.style.gridColumn; 

  const popupHTML = `
    <div id="popup">
      <div class="popup-content">
        <h3>Sửa thông tin</h3>
        <hr/>
        <label for="data-name">Tên phần tử:</label>
        <input type="text" id="data-name" value="${currentDataName}">
        <br>
        <label for="grid-column">Phân bố:</label>
        <select id="grid-column">
          ${createGridColumnOptions(currentGridColumn)}
        </select>
        <hr/>
        <div class="button-container">
          <button onclick="saveChanges('${pageItemId}')">Lưu</button>
          <button onclick="closePopup()">Hủy</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", popupHTML);
}

function createGridColumnOptions(currentGridColumn) {
  let options = '';
  for (let i = 1; i <= 12; i++) {
    const selected = (currentGridColumn === `span ${i}`) ? 'selected' : '';
    options += `<option value="span ${i}" ${selected}>${i}</option>`;
  }
  return options;
}

function saveChanges(pageItemId) {
  const newDataName = document.getElementById("data-name").value;
  const newGridColumn = document.getElementById("grid-column").value;
  const element = document.getElementById(pageItemId);
  element.setAttribute("data-name", newDataName);
  element.style.gridColumn = newGridColumn;
  closePopup();
  renderAdminContentsLayout();
}

function closePopup() {
  const popup = document.getElementById("popup");
  if (popup) {
    popup.remove();
  }
}

//======================================================================
//=================================View=================================
function displayAdminContents(pageItemId) {
  selectedAdminContents = pageItemId;
  renderAdminContents(); 
}

//==================================================================================================================
//=========================Admin contents===========================================================================
//==================================================================================================================
let selectedAdminContents = null;

function renderAdminContents() {
  const pageItemElement = document.getElementById(selectedAdminContents); 
  const pageItemHTML = pageItemElement.innerHTML;

  let adminContent = `
    <div>Admin Contents: "${getName(selectedMenuLeft)}/${getName(selectedAdminContents)}"</div>
    <!-- Preview -->
    <div>
      <h3>Preview:</h3>
      <hr>
        <div id="contentPreview" class="preview">${pageItemHTML}</div> 
      <hr>
    </div>
    <div style="margin: 10px;">
      <button id="editorTabButton" class="tab-button">Editor</button>
      <button id="textareaTabButton" class="tab-button">Textarea</button>
    </div>
    <div id="contentEditorContainer">
      <div id="editor" class="froala-editor" style="display: none;">${pageItemHTML}</div> 
      <textarea id="contentTextarea" placeholder="Nhập nội dung HTML ở đây" rows="10" cols="50" style="display: none;">
        ${pageItemHTML}
      </textarea>
    </div>

    <button id="saveButton" style="margin-top: 10px;">Save</button>
  `;

  adminPage.innerHTML = adminContent;

  // Tab switching functionality
  const editorTabButton = document.getElementById('editorTabButton');
  const textareaTabButton = document.getElementById('textareaTabButton');
  const editor = document.getElementById('editor');
  const textarea = document.getElementById('contentTextarea');

  let currentContent = pageItemHTML;  // Biến lưu trữ nội dung hiện tại của editor hoặc textarea

  // Khi chọn tab Editor
  editorTabButton.addEventListener('click', function () {
    editor.style.display = 'block';
    textarea.style.display = 'none';
    initFroalaEditor();  // Khởi tạo Froala Editor khi tab Editor được chọn
    updatePreview(); // Cập nhật preview ngay khi chọn tab Editor
  });

  // Khi chọn tab Textarea
  textareaTabButton.addEventListener('click', function () {
    editor.style.display = 'none';
    textarea.style.display = 'block';
    updatePreview(); // Cập nhật preview ngay khi chọn tab Textarea
  });

  // Mặc định chọn tab Editor
  editorTabButton.click();

  // Hàm khởi tạo Froala Editor
  function initFroalaEditor() {
    new FroalaEditor('#editor', {
      toolbarButtons: [
        'bold', 'italic', 'underline', 'fontSize', 'color', 'insertTable', 'align', 'formatOL', 'formatUL', 'link'
      ],
      pluginsEnabled: ['table', 'color', 'fontSize', 'align', 'lists', 'link'],
      height: 300,
      events: {
        // Cập nhật preview ngay lập tức khi nội dung trong editor thay đổi
        'contentChanged': function () {
          currentContent = document.querySelector('.fr-element').innerHTML; // Cập nhật nội dung khi thay đổi
          updatePreview(); // Cập nhật preview
        },
        'keyUp': function () {
          currentContent = document.querySelector('.fr-element').innerHTML; // Cập nhật nội dung khi gõ phím
          updatePreview(); // Cập nhật preview
        }
      }
    });
  }

  // Cập nhật nội dung preview
  function updatePreview() {
    const contentPreview = document.getElementById('contentPreview');
    const editorContent = document.querySelector('.fr-element');
    const textareaContent = document.getElementById('contentTextarea');

    // Nếu đang ở chế độ Editor, lấy nội dung từ Froala
    if (editor.style.display === 'block') {
      contentPreview.innerHTML = editorContent ? editorContent.innerHTML : currentContent;
    } else {
      // Nếu đang ở chế độ Textarea, lấy nội dung từ Textarea
      contentPreview.innerHTML = textareaContent.value;
    }
  }

  // Lắng nghe sự kiện nhập liệu ở Textarea
  const contentTextarea = document.getElementById('contentTextarea');
  contentTextarea.addEventListener('input', function () {
    currentContent = contentTextarea.value; 
    updatePreview(); 
  });

  const saveButton = document.getElementById('saveButton');
  saveButton.addEventListener('click', function() {
    let contentToSave;

    if (editor.style.display === 'block') {
      const editorContent = document.querySelector('.fr-element');
      contentToSave = editorContent ? editorContent.innerHTML : currentContent;
    } else {
      contentToSave = contentTextarea.value;
    }

    if (contentToSave) {
      pageItemElement.innerHTML = contentToSave;
      currentContent = contentToSave; 
      alert("Nội dung đã được lưu!");
      renderAdminContents();
    }
  });
}

//======================================================================
//==========================Cập nhật navbar=============================
function renderNavbar() {
  const navbar = document.getElementById('navbar');
  let navbarContent = ''; 
  navbarContent += `<a class="w3-bar-item w3-button w3-right w3-hide-large w3-hover-white w3-large w3-theme-l1" href="javascript:void(0)" onclick="w3_open()"><i class="fa fa-bars"></i></a>`;
  menuTopItems.forEach((page) => {
      navbarContent += `
      ${page.id == 'courseInfo' ? `
        <a href="#" onclick="showContent('courseInfo')" class="w3-bar-item w3-button">
        <i class="fas fa-home"></i>
      </a>
      ` : `
        <a href="javascript:void(0)" onclick="showContent('${page.id}')" class="w3-bar-item w3-button">${getName(page.id)}</a>
      `}
    `;
  });
  navbarContent += `<a href="javascript:void(0)" onclick="showContent('admin-page')" class="w3-bar-item w3-button">Admin page</a>`;
  navbar.innerHTML = navbarContent; 
}

//=======================================================================
//==========================Cập nhật sidebar=============================
function renderSidebar() {
  const selectedSection = document.getElementById(selectedMenuLeft);
  const container = selectedSection.querySelector('.container'); 
  const menuLeftItems = Array.from(container.children).filter(child => child.id);
  let sidebarContent = `<h4 class="w3-bar-item"><b>${getName(selectedMenuLeft)}</b></h4>`;
  menuLeftItems.forEach((element) => {
    sidebarContent += `<a class="w3-bar-item w3-button w3-hover-black" href="#${element.id}">${getName(element.id)}</a>`;
  });
  mySidebar.innerHTML = sidebarContent; 
}

//======================================================================
//=====================Tạo id từ chuỗi tiếng Việt=======================
function generateIdFromVietnameseText(text) {
  const vietnameseText = text.replace(/đ/g, "d").replace(/Đ/g, "D");
  const normalizedText = vietnameseText
    .toLowerCase()
    .normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, ""); 
  const slug = normalizedText
    .replace(/[^a-z0-9\s]/g, "") 
    .trim()
    .replace(/\s+/g, "-"); 
  return `${slug}-${Math.floor(Math.random() * 101)}`;
}

//======================================================================
//=================Lấy data-name của phần tử biết id====================
function getName(elementId) {
  const pageElement = document.getElementById(elementId);
  return pageElement ? pageElement.getAttribute('data-name') : null;
}
