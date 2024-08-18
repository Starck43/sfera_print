export default function NotFound() {
	return (
		<div>
			<style>
			{`
				h2 {
					position: absolute;
					display: flex;
					left: 50%;
					top: 50%;
					font-size: 1.2em;
					font-weight: 400;
					transform: translate(-50%, -50%);
				}
			`}
			</style>
			<h2>404<b style={{'color': '#FFF'}}>&nbsp;|&nbsp;</b>Страница не найдена</h2>
		</div>
	)
}
