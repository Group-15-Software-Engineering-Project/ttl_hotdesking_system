import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';

class LineChart extends Component {
  constructor(props){
    super(props);
    this.state = {
      lineData:props.lineData
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
        <Line
          data={this.state.lineData}
          options={{
            title:{
              display:this.props.displayTitle,
              text:'Most active day',
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

export default LineChart;