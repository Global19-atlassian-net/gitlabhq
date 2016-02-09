require 'rails_helper'

feature 'Issue filtering by Weight', feature: true do
  include Select2Helper

  let(:project)   { create(:project, :public) }
  let(:weight) { create(:weight, project: project) }
  let(:weight_num) {random_weight}

  before(:each) do
    create(:issue, project: project, weight: nil)
    create(:issue, project: project, weight: weight_num)
    create(:issue, project: project, weight: random_weight)
  end

  scenario 'filters by no Weight', js: true do
    visit_issues(project)
    filter_by_weight(Issue::WEIGHT_NONE)

    expect(page).to have_css('.issue', count: 1)
  end

  scenario 'filters by any Weight', js: true do
    visit_issues(project)
    filter_by_weight(Issue::WEIGHT_ANY)

    expect(page).to have_css('.issue', count: 1)
  end

  scenario 'filters by a specific Weight', js: true do
    visit_issues(project)
    filter_by_weight(weight_num)

    expect(page).to have_css('.issue', count: 1)
  end

  def visit_issues(project)
    visit namespace_project_issues_path(project.namespace, project)
  end

  def filter_by_weight(title)
    select2(title, from: '#weight')
  end

  def random_weight
    Issue::WEIGHT_RANGE.sample
  end
end
