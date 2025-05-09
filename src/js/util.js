/**
 * 
 */

export function stringToCharPositions(string) {
	return string
		.toUpperCase()
		.split('')
		.map(char => char.charCodeAt(0) - 'A'.charCodeAt(0) + 1).join('');
}

export function genRandomId(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let id = '';
	for (let i
		= 0; i < length; i++) {
		id += characters.charAt(Math.floor(Math.random()
			* characters.length));
	}
	return id;
}

export function sortQuestionIndexIndex(_questions){
	_questions.sort((a, b) => {
			// sort ascending
			return a.question_index - b.question_index;
			// sort descending
			//return b.question_index - a.question_index;
			
		});
}
export function sortArryOfObject(arrayObject , fieldName , desc) {
	if(desc){
		// ascending
		arrayObject.sort((a, b) => a[fieldName] - b[fieldName]);
	}
	else{
		arrayObject.sort((a, b) => b[fieldName] - a[fieldName]);
	}
}

