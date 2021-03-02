import React, {Component} from 'react';
import {Pie} from 'react-chartjs-2';

class PieChart extends Component {
  constructor(props){
    super(props);
    this.state = {
      pieData:props.pieData
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
        <Pie
          data={this.state.pieData}
          options={{
            title:{
              display:this.props.displayTitle,
              text:'Most used desk',
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

export default PieChart;