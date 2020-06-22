
document.body.addEventListener('click', (event:any) => {
  if (event.target.dataset.section) {
      handleSectionTrigger(event);
  } 
  //else if (event.target.dataset.modal) {
  //    handleModalTrigger(event)
  //} else if (event.target.classList.contains('modal-hide')) {
  //    hideAllModals()
  //}
});
/**
 * 启动界面
 */
function showMainContent() : void{
  document.querySelector('.js-nav').classList.add('is-shown');
  document.querySelector('.js-content').classList.add('is-shown');
}
function hideAllSectionsAndDeselectButtons() {
  let sections = document.querySelectorAll('.js-section.is-shown');
  Array.prototype.forEach.call(sections, (section:HTMLTableSectionElement) => {
      section.classList.remove('is-shown');
  })

  let buttons = document.querySelectorAll('.nav-rex-button.is-selected');
  Array.prototype.forEach.call(buttons, (button:HTMLButtonElement) => {
      button.classList.remove('is-selected');
  })
}
function handleSectionTrigger(event:any) {
  hideAllSectionsAndDeselectButtons();

  // Highlight clicked button and show view
  event.target.classList.add('is-selected')

  // Display the current section
  let sectionId = `${event.target.dataset.section}-section`;
  document.getElementById(sectionId).classList.add('is-shown');

  // Save currently active button in localStorage
  let buttonId = event.target.getAttribute('id');
  //settings.set('activeSectionButtonId', buttonId)
}
function activateDefaultSection() {
  document.getElementById('button-workpanel').click();
}
// run
showMainContent();
activateDefaultSection();
