import { supabase } from './supabase';

// 都道府県一覧
export async function getPrefectureRankings() {
  const { data, error } = await supabase
    .from('prefecture_kpis')
    .select('*')
    .order('pace_achievement_rate', { ascending: false });

  if (error) throw error;
  return data;
}

// 都道府県詳細 + 管内自治体
export async function getPrefectureWithMunicipalities(prefCode: string) {
  // まず都道府県KPIを取得
  const prefResult = await supabase
    .from('prefecture_kpis')
    .select('*')
    .eq('prefecture_code', prefCode)
    .single();

  if (prefResult.error) throw prefResult.error;

  // 該当都道府県の自治体コードリストを取得
  const munisListResult = await supabase
    .from('municipalities')
    .select('city_code')
    .eq('prefecture_code', prefCode);

  if (munisListResult.error) throw munisListResult.error;

  const cityCodes = munisListResult.data.map(m => m.city_code);

  // 自治体KPIを取得
  const munisResult = await supabase
    .from('municipality_kpis')
    .select(`
      *,
      municipalities(name, population, zero_carbon_declared)
    `)
    .in('city_code', cityCodes)
    .order('pace_achievement_rate', { ascending: false });

  if (munisResult.error) throw munisResult.error;

  return {
    prefecture: prefResult.data,
    municipalities: munisResult.data
  };
}

// 自治体詳細
export async function getMunicipalityDetail(cityCode: string) {
  const [kpiResult, emissionsResult] = await Promise.all([
    supabase
      .from('municipality_kpis')
      .select('*, municipalities(*)')
      .eq('city_code', cityCode)
      .single(),
    supabase
      .from('emissions')
      .select('*')
      .eq('city_code', cityCode)
      .order('fiscal_year', { ascending: true })
  ]);

  if (kpiResult.error) throw kpiResult.error;
  if (emissionsResult.error) throw emissionsResult.error;

  return {
    kpi: kpiResult.data,
    emissions: emissionsResult.data
  };
}
