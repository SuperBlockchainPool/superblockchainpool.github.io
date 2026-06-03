var API = 'https://superblockchain.zapto.org/miningcore/api/';
var URLSTRATUM = "superblockchain.zapto.org";
var defaultPool = 'lcc';
var ticketCoinPool = 'LCC';  
var currentPool = defaultPool;

function _formatter(value, decimal, unit) {
    if (value === 0) {
        return '0 ' + unit;
    } else {
        var si = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "K" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" },
            { value: 1e21, symbol: "Z" },
            { value: 1e24, symbol: "Y" },
        ];
        for (var i = si.length - 1; i > 0; i--) {
            if (value >= si[i].value) {
                break;
            }
        }
        return (value / si[i].value).toFixed(decimal).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + ' ' + si[i].symbol + unit;
    }
}

function loadPools(renderCallback) {
    $('#currentPool b').remove();
    $('#currentPool ul').remove();
    return $.ajax(API + 'pools')
        .done(function (data) {
            var poolList = '<ul class="dropdown-menu">';
            if (data.pools.length > 1) {
                $('#currentPool').attr('data-toggle', 'dropdown');
                $('#currentPool').append('<b class="caret"></b>');
            }
            $.each(data.pools, function (index, value) {
                if (currentPool.length === 0 && index === 0) {
                    currentPool = value.id;
                }
                if (currentPool === value.id) {
                    $('#currentPool p').attr('data-id', value.id);
                    $('#currentPool p').text(value.coin.type);
                } else {
                    poolList += '<li><a href="javascript:void(0)" data-id="' + value.id + '">' + value.coin.type + '</a></li>';
                }
            });
            poolList += '</ul>';
            if (poolList.length > 0) {
                $('#poolList').append(poolList);
            }
            if (data.pools.length > 1) {
                $('#poolList li a').on('click', function (event) {
                    currentPool = $(event.target).attr('data-id');
                    loadPools(renderCallback);
                });
            }
            if (renderCallback.has()) {
                renderCallback.fire();
            }
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadPools)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadStatsData() {
    return $.ajax(API + 'pools')
        .done(function (data) {
            $.each(data.pools, function (index, value) {
                if (currentPool === value.id) {
                    percentagePoolHashRate = (value.poolStats.poolHashrate * 100 / value.networkStats.networkHashrate).toFixed(2); 
                    $('#poolMiners').text(_formatter(value.poolStats.connectedMiners, 0, ''));
                    $('#percentagePoolHashRate').text(percentagePoolHashRate + ' %');
                    $('#poolHashRate').text(_formatter(value.poolStats.poolHashrate, 5, 'H/s'));
                    $('#networkHashRate').text(_formatter(value.networkStats.networkHashrate, 2, 'H/s'));
                    $('#networkDifficulty').text(_formatter(value.networkStats.networkDifficulty, 2, ''));
                    $('#networkBlock').text(value.networkStats.blockHeight, 0, '');
                    $('#connectedPeers').text(value.networkStats.connectedPeers, 0, '');
                    const isoString = value.networkStats.lastNetworkBlockTime;
                    const date = new Date(isoString);
                    const yyyy = date.getFullYear();
                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                    const dd = String(date.getDate()).padStart(2, '0');
                    const hh = String(date.getHours()).padStart(2, '0');
                    const mi = String(date.getMinutes()).padStart(2, '0');
                    const ss = String(date.getSeconds()).padStart(2, '0');
                    const lastNetworkBlockTime = `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
                    $('#lastNetworkBlockTime').text(lastNetworkBlockTime, 0, '');
                    $('#totalBlocks').text(value.totalBlocks, 0, '');
                    $('#totalPaid').text(value.totalPaid.toFixed(3), 0, '');
                    $('#poolEffort').text(((value.poolEffort)*100).toFixed(2) + ' %');
                    $('#poolFeePercent').text(value.poolFeePercent + ' %');
                    $('#payoutScheme').text(value.paymentProcessing.payoutScheme, 0, '');
                    $('#minimumPayment').text(value.paymentProcessing.minimumPayment, 0, '');
                }
            });
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadStatsData)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadStatsChart() {
    return $.ajax(API + 'pools/' + currentPool + '/performance')
        .done(function (data) {
            labels = [];
            connectedMiners = [];
            poolHashRate = [];
            networkDifficulty = [];
            networkHashRate = [];
            $.each(data.stats, function (index, value) {
                if (labels.length === 0 || (labels.length + 1) % 3 === 1) {
                    labels.push(new Date(value.created).toISOString().slice(11, 16));
                } else {
                    labels.push('');
                }
                poolHashRate.push(value.poolHashrate);
                connectedMiners.push(value.connectedMiners);
                networkDifficulty.push(value.networkDifficulty);
                networkHashRate.push(value.networkHashrate);
            });
            var options = {
                labels: labels,
                series: [{
                    name: 'Pool Hash Rate', 
                    data: poolHashRate,
                }],
                chart: {
                    type: 'area',
                    height: "60%",
                    width: "90%",
                    toolbar: {
                        tools: {
                        download: false,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false
                        }
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight',
                    width: 2,
                    colors: ['rgba(56, 145, 247, 1)']
                },
                markers: {
                    size: 3,        
                    strokeWidth: 1,   
                    strokeColors: '#3874f7ff'
                },
                tooltip: {
                    theme: 'dark',
                    enabled: false,
                    x: {
                        show: false
                    },
                    style: {
                        fontSize: '14px',
                        fontFamily: 'Arial'
                    }
                },
                grid: {
                    show: true,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    strokeDashArray: 0,
                    position: 'back',
                    xaxis: {
                        lines: {
                            show: true 
                        }
                    },
                    yaxis: {
                        lines: {
                            show: true
                        }
                    }
                },
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            colors: '#838383ff'
                        }
                    }        
                },
                yaxis: {
                    opposite: false,
                    labels: {
                            formatter: function(val) {
                                return _formatter(val, 1, 'H/s');
                            },
                            style: {
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                colors: '#838383ff'
                            }                            
                    }
                },
                fill: {
                    type: 'solid',
                    opacity: 0.15
                }           
            };

            var chart = new ApexCharts(document.querySelector("#chartStatsHashRate"), options);
            chart.render();

            var options = {
                labels: labels,
                series: [{
                    name: 'Miners',  
                    data: connectedMiners
                }],
                chart: {
                    height: "60%",
                    width: "90%",
                    type: 'bar',
                    toolbar: {
                        tools: {
                        download: false,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false
                        }
                    },
                },

                tooltip: {
                    theme: 'dark',
                    enabled: false,
                    x: {
                        show: false
                    },
                    style: {
                        fontSize: '14px',
                        fontFamily: 'Arial'
                    }
                },

                grid: {
                    show: true,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    strokeDashArray: 0,
                    position: 'back',
                    xaxis: {
                        lines: {
                            show: true 
                        }
                    },
                    yaxis: {
                        lines: {
                            show: true
                        }
                    }
                },
                
                plotOptions: {
                bar: {
                    borderRadius: 1
                }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: 0
                },
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            colors: '#838383ff'
                        }
                    }        
                },
                yaxis: {
                    //forceNiceScale: true,
                    //decimalsInFloat: 2,
                    labels: {
                        style: {
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            colors: '#838383ff'
                        }
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light',
                        type: "horizontal",
                        shadeIntensity: 0.25,
                        gradientToColors: undefined,
                        inverseColors: true,
                        opacityFrom: 0.85,
                        opacityTo: 0.85,
                        stops: [50, 0, 100]
                    },
                }
            };

            var chart = new ApexCharts(document.querySelector("#chartStatsMiners"), options);
            chart.render();

            var options = {
                labels: labels,
                series: [{
                    name: 'Network Difficulty', 
                    data: networkDifficulty,
                }],
                chart: {
                    type: 'area',
                    height: "60%",
                    width: "90%",
                    toolbar: {
                        tools: {
                        download: false,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false
                        }
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight',
                    width: 2,
                    colors: ['rgba(56, 145, 247, 1)']
                },
                markers: {
                    size: 3,        
                    strokeWidth: 1,   
                    strokeColors: '#3874f7ff'
                },
                tooltip: {
                    theme: 'dark',
                    enabled: false,
                    x: {
                        show: false
                    },
                    style: {
                        fontSize: '14px',
                        fontFamily: 'Arial'
                    }
                },
                grid: {
                    show: true,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    strokeDashArray: 0,
                    position: 'back',
                    xaxis: {
                        lines: {
                            show: true 
                        }
                    },
                    yaxis: {
                        lines: {
                            show: true
                        }
                    }
                },
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            colors: '#838383ff'
                        }
                    }        
                },
                yaxis: {
                    opposite: false,
                    labels: {
                            formatter: function(val) {
                                return _formatter(val, 2, '');
                            },
                            style: {
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                colors: '#838383ff'
                            }                            
                    }
                },
                fill: {
                    type: 'solid',
                    opacity: 0.15
                }           
            };

            var chart = new ApexCharts(document.querySelector("#chartNetworkDifficulty"), options);
            chart.render();
            
            var options = {
                labels: labels,
                series: [{
                    name: 'Network Hash Rate', 
                    data: networkHashRate,
                }],
                chart: {
                    type: 'area',
                    height: "60%",
                    width: "90%",
                    toolbar: {
                        tools: {
                        download: false,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false
                        }
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight',
                    width: 2,
                    colors: ['rgba(56, 145, 247, 1)']
                },
                markers: {
                    size: 3,        
                    strokeWidth: 1,   
                    strokeColors: '#3874f7ff'
                },
                tooltip: {
                    theme: 'dark',
                    enabled: false,
                    x: {
                        show: false
                    },
                    style: {
                        fontSize: '14px',
                        fontFamily: 'Arial'
                    }
                },
                grid: {
                    show: true,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    strokeDashArray: 0,
                    position: 'back',
                    xaxis: {
                        lines: {
                            show: true 
                        }
                    },
                    yaxis: {
                        lines: {
                            show: true
                        }
                    }
                },
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            colors: '#838383ff'
                        }
                    }        
                },
                yaxis: {
                    opposite: false,
                    labels: {
                            formatter: function(val) {
                                return _formatter(val, 2, 'H/s');
                            },
                            style: {
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                colors: '#838383ff'
                            }                            
                    }
                },
                fill: {
                    type: 'solid',
                    opacity: 0.15
                }           
            };

            var chart = new ApexCharts(document.querySelector("#chartNetworkHashRate"), options);
            chart.render();

        })
        
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadStatsChart)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadDashboardData(walletAddress) {
    var poolStatsRequest = $.ajax(API + 'pools'); 
    var minerStatsRequest = $.ajax(API + 'pools/' + currentPool + '/miners/' + walletAddress);

    return $.when(poolStatsRequest, minerStatsRequest)
        .done(function(poolResponse, minerResponse) {
            var poolData = poolResponse[0];
            var minerData = minerResponse[0];

            // Obtener poolHashrate
            var poolHashrate = 0;
            $.each(poolData.pools, function(index, value) {
                if (currentPool === value.id) {
                    poolHashrate = value.poolStats.poolHashrate;
                }
            });

            // Calcular hashrate total del minero
            var minerHashrate = 0;
            if (minerData.performance) {
                $.each(minerData.performance.workers, function(index, value) {
                    minerHashrate += value.hashrate;
                });
            }

            var numWorkers = 0;
            if (minerData.performance && minerData.performance.workers) {
                var workers = minerData.performance.workers;
                numWorkers = Object.keys(workers).length;
            }

            // Mostrar datos
            $('#minerHashRate').text(_formatter(minerHashrate, 5, 'H/s'));
            $('#pendingShares').text(_formatter(minerData.pendingShares, 0, ''));
            $('#pendingBalance').text((minerData.pendingBalance).toFixed(4) + ticketCoinPool);
            $('#paidBalance').text((minerData.totalPaid).toFixed(4) + ticketCoinPool);
            $('#lifetimeBalance').text((minerData.pendingBalance + minerData.totalPaid).toFixed(4) + ticketCoinPool);
            $('#minerWorkerCount').text(numWorkers);

            // Calcular y mostrar % de contribución del minero
            if (poolHashrate > 0) {
                var minerContribution = (minerHashrate * 100 / poolHashrate).toFixed(2);
                $('#minerContribution').text(minerContribution + ' %');
            } else {
                $('#minerContribution').text('0 %');
            }
        })
        .fail(function() {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadDashboardData + poolStats)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadDashboardWorkerList(walletAddress) {
    return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress)
        .done(function (data) {
            var workerList = '' 

            if (data.performance) {
                var workerCount = 0;
                $.each(data.performance.workers, function(index, value) {
                    workerCount++;
                    workerList += '<tr>';
                    if (index.length === 0) {
                        workerList += '<td>Unnamed</td>';
                    } else {
                        workerList += '<td>' + index + '</td>';
                    }
                    workerList += '<td>' + _formatter(value.hashrate, 5, 'H/s') + '</td>';
                    workerList += '<td>' + _formatter(value.sharesPerSecond, 5, 'S/s') + '</td>';
                    workerList += '</tr>';
                });
            } else {
                workerList += '<tr><td colspan="3">None</td></tr>';
            }
            workerList += '</tbody>';

            var $table = $('#workerList');

            // Si ya existe un tbody, lo eliminamos para actualizarlo
            $table.find('tbody').remove();

            // Crear un nuevo tbody y añadir las filas
            $('<tbody></tbody>').html(workerList).appendTo($table);
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadDashboardWorkerList)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadDashboardChart(walletAddress) {
    return $.ajax(API + 'pools/' + currentPool + '/miners/' + walletAddress + '/performance')
        .done(function (data) {
            if (data.length > 0) {
                labels = [];
                minerHashRate = [];
                $.each(data, function (index, value) {
                    if (labels.length === 0 || (labels.length + 1) % 4 === 1) {
                        labels.push(new Date(value.created).toISOString().slice(11, 16));
                    } else {
                        labels.push('');
                    }
                    var workerHashRate = 0;
                    $.each(value.workers, function (index2, value2) {
                        workerHashRate += value2.hashrate;
                    });
                    minerHashRate.push(workerHashRate);
                });
                ///////
                var options = {
                    labels: labels,
                    series: [{
                        name: 'Miner Hash Rate', 
                        data: minerHashRate,
                    }],
                    chart: {
                        type: 'area',
                        height: "60%",
                        width: "95%",
                        toolbar: {
                            tools: {
                            download: false,
                            selection: false,
                            zoom: false,
                            zoomin: false,
                            zoomout: false,
                            pan: false,
                            reset: false
                            }
                        },
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'straight',
                        width: 2,
                        colors: ['rgba(56, 145, 247, 1)']
                    },
                    markers: {
                        size: 3,        
                        strokeWidth: 1,   
                        strokeColors: '#3874f7ff'
                    },
                    tooltip: {
                        theme: 'dark',
                        enabled: false,
                        x: {
                            show: false
                        },
                        style: {
                            fontSize: '14px',
                            fontFamily: 'Arial'
                        }
                    },
                    grid: {
                        show: true,
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        strokeDashArray: 0,
                        position: 'back',
                        xaxis: {
                            lines: {
                                show: true 
                            }
                        },
                        yaxis: {
                            lines: {
                                show: true
                            }
                        }
                    },
                    xaxis: {
                        labels: {
                            show: true,
                            style: {
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                colors: '#838383ff'
                            }
                        }        
                    },
                    yaxis: {
                        opposite: false,
                        labels: {
                                formatter: function(val) {
                                    return _formatter(val, 2, 'H/s');
                                },
                                style: {
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    colors: '#838383ff'
                                }                            
                        }
                    },
                    fill: {
                        type: 'solid',
                        opacity: 0.15
                    }           
                };

                var chart = new ApexCharts(document.querySelector("#chartDashboardHashRate"), options);
                chart.render();
            }
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadDashboardChart)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadMinersList() {
    return $.ajax(API + 'pools/' + currentPool + '/miners')
        .done(function (data) {
            var minerList = '<thead><tr><th>Address</th><th><span data-i18n="hashrate">Hash Rate</span></th><th>Share Rate</th></tr></thead><tbody>';
            if (data.length > 0) {
                $.each(data, function (index, value) {
                    minerList += '<tr>';
                    minerList += '<td>' + value.miner.substring(0, 12) + ' &hellip; ' + value.miner.substring(value.miner.length - 12) + '</td>';
                    minerList += '<td>' + _formatter(value.hashrate, 5, 'H/s') + '</td>';
                    minerList += '<td>' + _formatter(value.sharesPerSecond, 5, 'S/s') + '</td>';
                    minerList += '</tr>';
                });
            } else {
                minerList += '<tr><td colspan="3">None</td></tr>';
            }
            minerList += '</tbody>';
            $('#minerList').html(minerList);
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadMinersList)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadBlocksList() {
    return $.ajax(API + 'pools/' + currentPool + '/blocks?pageSize=100')
        .done(function (data) {
            var blockList = '<thead><tr><th colspan="2">Date &amp; Time</th><th>Height</th><th>Status</th><th>Reward</th><th>Confirmation</th><th>TxID</th></tr></thead><tbody>';
            if (data.length > 0) {
                $.each(data, function (index, value) {
                    blockList += '<tr>';
                    blockList += '<td colspan="2">' + new Date(value.created).toLocaleString() + '</td>';
                    blockList += '<td>' + value.blockHeight + '</td>';
                    blockList += '<td style="text-transform: capitalize">' + value.status + '</td>';
                    blockList += '<td>' + _formatter(value.reward, 5, '') + '</td>';
                    blockList += '<td>' + Math.round(value.confirmationProgress * 100) + '%</td>';
                    blockList += '<td colspan="3"><a href="' + value.infoLink + '" target="_blank">' + value.transactionConfirmationData.substring(0, 16) + ' &hellip; ' + value.transactionConfirmationData.substring(value.transactionConfirmationData.length - 16) + ' </a></td>';
                    blockList += '</tr>'
                });
            } else {
                blockList += '<tr><td colspan="5">None</td></tr>';
            }
            blockList += '</tbody>';
            $('#blockList').html(blockList);
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadBlocksList)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadPaymentsList() {
    return $.ajax(API + 'pools/' + currentPool + '/payments?pageSize=500')
        .done(function (data) {
            var paymentList = '<thead><tr><th colspan="2">Date &amp; Time</th><th colspan="2">Address</th><th>Amount</th><th colspan="2">TxID</th></tr></thead><tbody>';
            if (data.length > 0) {
                $.each(data, function (index, value) {
                    paymentList += '<tr>';
                    paymentList += '<td colspan="2">' + new Date(value.created).toLocaleString() + '</td>';
                    paymentList += '<td colspan="2"><a href="' + value.addressInfoLink + '" target="_blank">' + value.address.substring(0, 12) + ' &hellip; ' + value.address.substring(value.address.length - 12) + '</td>';
                    paymentList += '<td>' + (value.amount).toFixed(4) + '</td>';
                    paymentList += '<td colspan="3"><a href="' + value.transactionInfoLink + '" target="_blank">' + value.transactionConfirmationData.substring(0, 16) + ' &hellip; ' + value.transactionConfirmationData.substring(value.transactionConfirmationData.length - 16) + ' </a></td>';
                    paymentList += '</tr>';
                });
            } else {
                paymentList += '<tr><td colspan="3">No payments made.</td></tr>';
            }
            paymentList += '</tbody>';
            $('#paymentList').html(paymentList);
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadPaymentsList)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadConnectConfig() {
    return $.ajax(API + 'pools')
        .done(function (data) {
            var connectPoolConfig = '<thead><tr><th>Item</th><th>Value</th></tr></thead><tbody>';
            $.each(data.pools, function (index, value) {
                if (currentPool === value.id) {
                    algorithm = value.coin.algorithm;
                    connectPoolConfig += '<tr><td>Stratum URL</td><td>' + URLSTRATUM + '</td></tr>';
                    connectPoolConfig += '<tr><td>Algorithm</td><td>' + value.coin.algorithm + '</td></tr>';
                    connectPoolConfig += '<tr><td>Pool Address</td><td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address.substring(0, 12) + ' &hellip; ' + value.address.substring(value.address.length - 12) + '</a></td></tr>';
                    connectPoolConfig += '<tr><td>Payout Scheme</td><td>' + value.paymentProcessing.payoutScheme + '</td></tr>';
                    connectPoolConfig += '<tr><td>Minimum Payment</td><td>' + value.paymentProcessing.minimumPayment + '</td></tr>';
                    if (typeof(value.paymentProcessing.minimumPaymentToPaymentId) !== "undefined") {
                        connectPoolConfig += '<tr><td>Minimum Payment w/ #</td><td>' + value.paymentProcessing.minimumPaymentToPaymentId + '</td></tr>';
                    }
                    connectPoolConfig += '<tr><td>Pool Fee</td><td>' + value.poolFeePercent + '%</td></tr>';
                    $.each(value.ports, function (port, options) {
                        connectPoolConfig += '<tr><td>Port ' + port + ' Difficulty</td><td>';
                        if (typeof(options.varDiff) !== "undefined") {
                            connectPoolConfig += 'Variable / ' + options.varDiff.minDiff + ' &harr; ';
                            if (typeof(options.varDiff.maxDiff) === "undefined") {
                                connectPoolConfig += '&infin;';
                            } else {
                                connectPoolConfig += options.varDiff.maxDiff;
                            }
                        } else {
                            connectPoolConfig += 'Static / ' + options.difficulty;
                        }
                        connectPoolConfig += '</td></tr>';
                    });
                }
            });
            connectPoolConfig += '</tbody>';
            $('#connectPoolConfig').html(connectPoolConfig);
            $('.algorithm').html(algorithm);

        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadConnectConfig)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function submitSettings() {
  console.log("Botón clickeado");
  const walletAddress2 = $("#walletAddress2").val();

  return $.ajax({
    url: API + "pools/" + currentPool + "/miners/" + walletAddress2 + "/settings",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      ipAddress: $("#ipAddress").val(),
      settings: {
        paymentThreshold: $("#minimumPayout").val()
      }
    })
  })
    .done(function (data) {
      $('#updateSuccess').show();
      $("#minimumPayout").val(data.paymentThreshold);

      setTimeout(function () {
        $('#updateSuccess').hide();
      }, 5000);
    })
    .fail(function (xhr) {
  console.error("ERROR SETTINGS");
  console.error("Status:", xhr.status);
  console.error("Response:", xhr.responseText);

  $('#updateFailed').show();

  setTimeout(function () {
    $('#updateFailed').hide();
  }, 5000);
});

}

function paymentsMinerList(walletAddress) {
    return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress + "/payments")
        .done(function (data) {
            var paymentsMinerList = '';

            if (data && data.length > 0) {
                $.each(data, function(index, payment) {
                    paymentsMinerList += '<tr>';
                    paymentsMinerList += '<td>' + new Date(payment.created).toLocaleString() + '</td>';
                    paymentsMinerList += '<td>' + payment.amount.toFixed(4) + '</td>';
                    paymentsMinerList += '<td><a href="' + payment.transactionInfoLink + '" target="_blank">' + payment.transactionConfirmationData.substring(0, 25) + ' &hellip; ' + payment.transactionConfirmationData.substring(payment.transactionConfirmationData.length - 25) + '</a></td>';
                    paymentsMinerList += '</tr>';
                });
            } else {
                paymentsMinerList += '<tr><td colspan="5">None</td></tr>';
            }

            // Obtener la tabla
            var $table = $('#paymentsMinerList');

            // Si ya existe un tbody, lo eliminamos para actualizarlo
            $table.find('tbody').remove();

            // Crear un nuevo tbody y añadir las filas
            $('<tbody></tbody>').html(paymentsMinerList).appendTo($table);
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function settingsFormBottom() {
  const elemento = document.getElementById("minerconfigurationtemplate");
  
  const currentDisplay = window.getComputedStyle(elemento).display;

  elemento.style.display = (currentDisplay === "none") ? "flex" : "none";
  
  const img = document.getElementById("openandclosed");

  if (img.src.includes("assets/img/settings.svg")) {
    img.src = "assets/img/x-thin.svg";
  } else {
    img.src = "assets/img/settings.svg";
  }

}
