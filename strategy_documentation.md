# Advanced Crypto Strategy for DOGEUSDT

## Overview
This Pine Script strategy is designed specifically for cryptocurrency trading with a focus on liquidity zones, volume analysis, and trend detection. It's optimized for volatile markets like DOGEUSDT with a 15-minute timeframe.

## Key Features

### 1. Liquidity Zone Detection
- Uses pivot high/low detection to identify historical support and resistance levels
- Stores multiple liquidity zones (up to 5 most recent levels)
- Identifies breakouts and breakdowns from these zones

### 2. Volume Analysis
- Calculates volume moving average to identify high-volume periods
- Uses volume threshold multiplier to detect significant volume spikes
- Requires high volume for entry confirmation

### 3. Trend Detection (for confirmation only)
- Uses multiple EMAs and SMAs for multi-timeframe trend analysis
- EMA 8/21 for short-term trend
- SMA 50 for medium-term trend
- VWAP for liquidity-based trend confirmation

### 4. Risk Management
- Configurable profit target (default 2%)
- 1% stop loss
- Trailing stops based on ATR
- Multiple confirmation requirements for entries

## Input Parameters
- **Minimum Profit Target**: Minimum expected profit percentage (default 2.0%)
- **ATR Length**: Period for Average True Range calculation (default 14)
- **Volume MA Length**: Period for volume moving average (default 20)
- **Lookback Period**: For liquidity zone detection (default 100)
- **Liquidity Zone Sensitivity**: ATR multiplier for reversal zones (default 0.5)
- **Volume Threshold Multiplier**: How much above average volume is required (default 1.5)

## Entry Conditions

### Long Entry
- Breakout above resistance level OR price approaching support zone
- Confirmed by bullish trend (EMA8 > EMA21 AND close > SMA50) OR VWAP bullish
- High volume confirmation

### Short Entry
- Breakdown below support level OR price approaching resistance zone
- Confirmed by bearish trend (EMA8 < EMA21 AND close < SMA50) OR VWAP bearish
- High volume confirmation

## Backtesting Instructions

To backtest this strategy:

1. Open TradingView and create a new Pine Script
2. Copy the entire code from `doge_strategy.pine`
3. Apply to DOGEUSDT chart with 15-minute timeframe
4. Set the date range to cover a full year of data
5. Run the strategy and observe the performance statistics

## Expected Performance Metrics
The strategy will display:
- Number of winning trades
- Number of losing trades
- Total trades
- Win rate percentage
- Average win amount
- Average loss amount

## Risk Considerations
- Cryptocurrency markets are highly volatile
- Past performance doesn't guarantee future results
- Use appropriate position sizing
- Consider market conditions and news events
- Monitor the strategy during high-impact news releases

## Strategy Logic Summary
The strategy combines multiple sophisticated techniques to identify high-probability trade setups:
1. Liquidity zones provide key support/resistance levels
2. Volume analysis confirms institutional interest
3. Multi-timeframe trend analysis ensures trades align with broader trends
4. VWAP provides liquidity-based trend confirmation
5. ATR-based stops adapt to market volatility
6. Multiple confirmations reduce false signals