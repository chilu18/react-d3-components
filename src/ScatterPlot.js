let React = require('./ReactProvider');
let d3 = require('./D3Provider');

let Chart = require('./Chart');
let Axis = require('./Axis');
let Tooltip = require('./Tooltip');

let DefaultPropsMixin = require('./DefaultPropsMixin');
let HeightWidthMixin = require('./HeightWidthMixin');
let ArrayifyMixin = require('./ArrayifyMixin');
let AccessorMixin = require('./AccessorMixin');
let DefaultScalesMixin = require('./DefaultScalesMixin');
let TooltipMixin = require('./TooltipMixin');

let DataSet = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired,
		symbol: React.PropTypes.func.isRequired,
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired,
		onMouseEnter: React.PropTypes.func,
		onMouseLeave: React.PropTypes.func
	},

	render() {
		let {data,
			 symbol,
			 xScale,
			 yScale,
			 colorScale,
			 values,
			 x,
			 y,
			 onMouseEnter,
			 onMouseLeave} = this.props;

		let circles = data.map(stack => {
			return values(stack).map(e => {
				let translate = `translate(${xScale(x(e))}, ${yScale(y(e))})`;
				return (
						<path
					className="dot"
					d={symbol()}
					transform={translate}
					fill={colorScale(stack.label)}
					onMouseOver={ evt => { onMouseEnter(evt, e); } }
					onMouseLeave={  evt => { onMouseLeave(evt); } }
						/>
				);
			});
		});

		return (
				<g>
				{circles}
			</g>
		);
	}
});

let ScatterPlot = React.createClass({
	mixins: [DefaultPropsMixin,
			 HeightWidthMixin,
			 ArrayifyMixin,
			 AccessorMixin,
			 DefaultScalesMixin,
			 TooltipMixin],

	propTypes: {
		rScale: React.PropTypes.func,
		shape: React.PropTypes.string
	},

	getDefaultProps() {
		return {
			rScale: null,
			shape: 'circle',
			tooltipHtml: (d, position, xScale, yScale) => {
				return d.y.toString();
			}
		};
	},

	render() {
		let {data,
			 height,
			 width,
			 innerHeight,
			 innerWidth,
			 margin,
			 xScale,
			 yScale,
			 colorScale,
			 rScale,
			 shape,
			 xIntercept,
			 yIntercept,
			 values,
			 x,
			 y} = this.props;

		let symbol = d3.svg.symbol().type(shape);

		if (rScale) {
			symbol = symbol.size(rScale);
		}

		return (
			<div>
				<Chart height={height} width={width} margin={margin}>
				<Axis
			orientation="bottom"
			scale={xScale}
			height={innerHeight}
			zero={yIntercept}
				/>

				<Axis
			orientation="left"
			scale={yScale}
			width={innerWidth}
			zero={xIntercept}
				/>

				<DataSet
			data={data}
			xScale={xScale}
			yScale={yScale}
			colorScale={colorScale}
			symbol={symbol}
			values={values}
			x={x}
			y={y}
			onMouseEnter={this.onMouseEnter}
			onMouseLeave={this.onMouseLeave}
				/>
				</Chart>

				<Tooltip
			hidden={this.state.tooltip.hidden}
			top={this.state.tooltip.top}
			left={this.state.tooltip.left}
			html={this.state.tooltip.html}/>
				</div>
		);
	}
});

module.exports = ScatterPlot;