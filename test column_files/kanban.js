const drag = (event) => {
	event.dataTransfer.setData('text/plain', event.target.id);
};

const allowDrop = (ev) => {
	ev.preventDefault();
	if (hasClass(ev.target, 'dropzone')) {
		addClass(ev.target, 'droppable');
	}
};

const clearDrop = (ev) => {
	removeClass(ev.target, 'droppable');
};

const drop = (event) => {
	event.preventDefault();
	const data = event.dataTransfer.getData('text/plain');
	console.warn(data);
	const element = document.getElementById(data);
	try {
		// remove the spacer content from dropzone
		event.target.removeChild(event.target.firstChild);
		// add the draggable content
		event.target.appendChild(element);
		// remove the dropzone parent
		unwrap(event.target);
	} catch (error) {
		console.warn(error);
	}
	updateDropzones();
};

const updateDropzones = () => {
	/* after dropping, refresh the drop target areas
      so there is a dropzone after each item
      using jQuery here for simplicity */

	var dz = $('<div class="dropzone rounded" ondrop="drop(event)" ondragover="allowDrop(event)" ondragleave="clearDrop(event)"> &nbsp; </div>');

	// delete old dropzones
	$('.dropzone').remove();

	// insert new dropdzone after each item
	dz.insertAfter('.col_kanban__body--box.draggable');

	// insert new dropzone in any empty swimlanes
	$('.col_kanban__body:not(:has(.col_kanban__body--box.draggable))').append(dz);
};

// helpers
var hasClass = (target, className) => {
	return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
};

var addClass = (ele, cls) => {
	if (!hasClass(ele, cls)) ele.className += ' ' + cls;
};

var removeClass = (ele, cls) => {
	if (hasClass(ele, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		ele.className = ele.className.replace(reg, ' ');
	}
};

var unwrap = (node) => {
	node.replaceWith(...node.childNodes);
};

// var addKanbanColumn = () => {
// 	var template = $('#childParamTemplate').html();
// 	$('.append_template_jobgroup').on('click', () => {
// 		var kanban = $(this).closest('.col_kanban');
//     console.log(template, kanban);
//     template.clone().insertAfter(kanban);
// 	});
// };
