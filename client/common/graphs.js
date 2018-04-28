import * as d3 from 'd3'
import _ from 'lodash'

const margins = { top: 40, right: 40, bottom: 40, left: 40 }
const colors = ['blue', 'green']

class GroupedBarGraphRenderer {
	constructor(node, data) {
		this.node = node
		this.innerNode = d3.select(this.node).append('g')

		this.sets = data.sets
		this.xAxis = data.xAxis
		this.yAxis = data.yAxis
		this.width = 	data.width - margins.right - margins.left
		this.height = 	data.height - margins.top - margins.bottom

		this.xScales = this.sets.map(set => {
			const domain = set.map(d => _.get(d, this.xAxis))
			return d3.scaleBand().domain(domain).rangeRound([0, data.width]).padding(0.1)
		})

		const yMax = this.sets.map(set => d3.max(set, d => _.get(d, this.yAxis)))
		this.yScale = d3.scaleLinear().domain([0, d3.max(yMax)]).rangeRound([this.height, 0])

		this.renderGraph = this.renderGraph.bind(this)
		this.renderSet = this.renderSet.bind(this)
	}

	renderSet(set, index) {
		this.innerNode.selectAll('bar').data(set)
			.enter().append('rect')
			.style('fill', colors[index])
			.attr('x', d => this.xScales[index](_.get(d, this.xAxis)) + (index !== 0 ? this.xScales[index].bandwidth()/2 : 0))
			.attr('width', this.xScales[index].bandwidth()/2)
			.attr('y', d => this.yScale(_.get(d, this.yAxis)))
			.attr('height', d => this.height - this.yScale(_.get(d, this.yAxis)))
	}

	renderGraph() {
		if (this.sets.map(set => set.lenght)) {
			this.innerNode.attr('transform', `translate(${margins.top}, ${margins.left})`)

			this.innerNode.append('g').attr('class', 'axis axis--x')
				.attr('transform', `translate(0, ${this.height})`)
				.call(d3.axisBottom(this.xScales[0]))

			this.innerNode.append('g').attr('class', 'axis axis--y')
				.call(d3.axisLeft(this.yScale).ticks(9))

			this.sets.forEach(this.renderSet)
		}
		else {
			d3.select(this.node).selectAll('*').remove()
		}
	}
}

export default GroupedBarGraphRenderer