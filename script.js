const socket = new WebSocket('ws://localhost:8081');

    socket.onopen = () => {
      document.getElementById('status').textContent = 'Connected to WebSocket server';
      console.log('WebSocket connection established');
    };

    socket.onclose = () => {
      document.getElementById('status').textContent = 'Connection closed';
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      document.getElementById('status').textContent = 'WebSocket error occurred';
      console.log('WebSocket Error:', error);
    };

    socket.onmessage = (event) => {
      const sensorData = event.data.split(',');

      let sensor1 = NaN, sensor2 = NaN, sensor3 = NaN, sensor4 = NaN;

      sensorData.forEach((data) => {
        const [sensor, value] = data.split(':').map(item => item.trim());
        if (sensor && value) {
          switch (sensor) {
            case 'S1': sensor1 = parseFloat(value); break;
            case 'S2': sensor2 = parseFloat(value); break;
            case 'S3': sensor3 = parseFloat(value); break;
            case 'S4': sensor4 = parseFloat(value); break;
          }
        }
      });

      document.getElementById('data').innerHTML = `
        <div>Sensor 1 (Forefoot): ${sensor1}</div>
        <div>Sensor 2 (Midfoot): ${sensor2}</div>
        <div>Sensor 3 (Forefoot): ${sensor3}</div>
        <div>Sensor 4 (Rearfoot): ${sensor4}</div>
      `;

      // Reset solution sections
      document.getElementById('flatfoot-solutions').style.display = 'none';
      document.getElementById('higharch-solutions').style.display = 'none';
      document.getElementById('normalfoot-solutions').style.display = 'none';

      let footType = 'Normal Foot';
      let footClass = 'normal';

      if (isNaN(sensor1) || isNaN(sensor2) || isNaN(sensor3) || isNaN(sensor4)) {
        footType = 'Error - Sensor Data Missing';
      }
      // ✅ Flatfoot detection logic
      else if (
        sensor2 >= 1900 && sensor2 <= 5000 &&
        sensor1 > 700 && sensor3 > 700 && sensor4 > 700
      ) {
        footType = 'Flatfoot';
        footClass = 'flatfoot';
        document.getElementById('flatfoot-solutions').style.display = 'block';
      }
      // ✅ High arch detection logic
      else if (
        sensor2 < 300 &&
        sensor1 > 800 && sensor3 > 800 && sensor4 > 800
      ) {
        footType = 'High Arch';
        footClass = 'higharch';
        document.getElementById('higharch-solutions').style.display = 'block';
      }
      // ✅ Normal foot detection logic
      else if (
        sensor2 >= 300 && sensor2 < 1900 &&
        sensor1 > 700 && sensor3 > 700 && sensor4 > 700
      ) {
        footType = 'Normal Foot';
        footClass = 'normal';
        document.getElementById('normalfoot-solutions').style.display = 'block';
      }
      else {
        footType = 'Unclassified Foot Type';
      }

      document.getElementById('foot-type').textContent = `Foot type: ${footType}`;
      document.getElementById('foot-type').className = `foot-type ${footClass}`;
    };