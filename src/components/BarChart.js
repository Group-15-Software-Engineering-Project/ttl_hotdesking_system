import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';

class BarChart extends Component {
  constructor(props){
    super(props);
    this.state = {
      barData:props.barData
    }
  }

  static defaultProps = {
    displayTitle:true,
    displayLegend: true,
    legendPosition:'right'
  }

  render(){
    return (
      <div className="chart" style={{ position: "relative", margin: "auto", width: "80vw" }}>
        <Bar 
          data={this.state.barData}
          options={{
            title:{
              display:this.props.displayTitle,
              text:'Most active user',
              fontSize:25
            },
            legend:{
              display:this.props.displayLegend,
              position:this.props.legendPosition
            },
          }}
        />
      </div>
    )
  }
}

export default BarChart;