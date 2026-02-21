"""
KPI計算ロジック
content.mdの計算式を実装
"""
import numpy as np
from typing import Dict, List, Tuple


def calc_actual_pace(base_emission: float, latest_emission: float,
                      base_year: int = 2013, latest_year: int = 2022) -> float:
    """
    実績ペース（年平均削減率）を計算

    Args:
        base_emission: 基準年の排出量（千t-CO₂）
        latest_emission: 最新年の排出量（千t-CO₂）
        base_year: 基準年（デフォルト2013）
        latest_year: 最新年（デフォルト2022）

    Returns:
        年平均削減率（%/年）
    """
    if base_emission <= 0 or latest_emission <= 0:
        return 0.0

    years = latest_year - base_year
    if years <= 0:
        return 0.0

    # 年複利換算
    rate = (1 - (latest_emission / base_emission) ** (1 / years)) * 100
    return round(rate, 2)


def calc_required_pace(base_emission: float,
                        target_reduction_rate: float = 0.46,
                        base_year: int = 2013,
                        target_year: int = 2030) -> float:
    """
    必要ペース（2030年目標達成に必要な年平均削減率）を計算

    Args:
        base_emission: 基準年の排出量（千t-CO₂）
        target_reduction_rate: 目標削減率（デフォルト0.46 = 46%削減）
        base_year: 基準年（デフォルト2013）
        target_year: 目標年（デフォルト2030）

    Returns:
        必要な年平均削減率（%/年）
    """
    if base_emission <= 0:
        return 0.0

    target_emission = base_emission * (1 - target_reduction_rate)
    years = target_year - base_year  # 17年

    if years <= 0:
        return 0.0

    rate = (1 - (target_emission / base_emission) ** (1 / years)) * 100
    return round(rate, 2)


def calc_pace_achievement_rate(actual_pace: float, required_pace: float) -> float:
    """
    ペース達成率を計算

    Args:
        actual_pace: 実績ペース（%/年）
        required_pace: 必要ペース（%/年）

    Returns:
        ペース達成率（%）
    """
    if required_pace <= 0:
        return 0.0

    return round(actual_pace / required_pace * 100, 1)


def calc_shortfall_2030(base_emission: float,
                         actual_pace: float,
                         base_year: int = 2013,
                         target_year: int = 2030,
                         target_reduction_rate: float = 0.46) -> float:
    """
    2030年予測不足量を計算

    Args:
        base_emission: 基準年の排出量（千t-CO₂）
        actual_pace: 実績ペース（%/年）
        base_year: 基準年（デフォルト2013）
        target_year: 目標年（デフォルト2030）
        target_reduction_rate: 目標削減率（デフォルト0.46）

    Returns:
        2030年予測不足量（千t-CO₂）
    """
    if base_emission <= 0:
        return 0.0

    target = base_emission * (1 - target_reduction_rate)
    years = target_year - base_year

    # 現在のペースで推移した場合の2030年排出量
    forecast = base_emission * ((1 - actual_pace / 100) ** years)

    # 不足量（正の値 = 削減不足、負の値 = 目標達成）
    shortfall = forecast - target

    return round(max(0, shortfall), 1)


def calc_reduction_rate(base_emission: float, latest_emission: float) -> float:
    """
    削減率を計算

    Args:
        base_emission: 基準年の排出量（千t-CO₂）
        latest_emission: 最新年の排出量（千t-CO₂）

    Returns:
        削減率（%）負の値 = 削減、正の値 = 増加
    """
    if base_emission <= 0:
        return 0.0

    rate = ((latest_emission - base_emission) / base_emission) * 100
    return round(rate, 2)


def calc_deviation_score(values: List[float], target_value: float) -> float:
    """
    偏差値を計算（同規模グループ内での相対位置）

    Args:
        values: 比較対象の値リスト
        target_value: 対象の値

    Returns:
        偏差値（平均50、標準偏差10）
    """
    if len(values) < 2:
        return 50.0

    mean = np.mean(values)
    std = np.std(values)

    if std == 0:
        return 50.0

    # 削減率の場合、低い方（より削減）が良いので符号を反転
    deviation = 50 + 10 * (mean - target_value) / std

    return round(deviation, 1)


def determine_status(pace_achievement_rate: float) -> str:
    """
    ステータスを判定

    Args:
        pace_achievement_rate: ペース達成率（%）

    Returns:
        ステータス（'on-track' / 'at-risk' / 'off-track'）
    """
    if pace_achievement_rate >= 100:
        return 'on-track'
    elif pace_achievement_rate >= 80:
        return 'at-risk'
    else:
        return 'off-track'


def calc_emission_per_capita(total_emission: float, population: int) -> float:
    """
    一人あたり排出量を計算

    Args:
        total_emission: 総排出量（千t-CO₂）
        population: 人口

    Returns:
        一人あたり排出量（t-CO₂/人）
    """
    if population <= 0:
        return 0.0

    # 千t → t に変換してから人口で割る
    per_capita = (total_emission * 1000) / population
    return round(per_capita, 3)
