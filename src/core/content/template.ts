export const HTML_TEMPLATE = `
<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="color-scheme" content="light dark" />
	<link rel="stylesheet" href="/_/index.css" />
	<link rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
	<link
		href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;800;900&family=Inter&family=Fira+Sans&display=swap"
		rel="stylesheet">
	<title>{{ title }}</title>
</head>

<body>
	<div id="app">{{ html }}</div>
</body>
<script>window.__EASYDOCS__ = {hello: true};</script>
<script src="/_/index.js"></script>
<!-- <script src="https://cdn.jsdelivr.net/npm/preact@10.19.3/dist/preact.min.js"></script> -->

</html>
`;