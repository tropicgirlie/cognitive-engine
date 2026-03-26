-- Seed data for Cognitive Load Intervention Engine
-- Initial taxonomy and sample principles

-- Disciplines
INSERT INTO disciplines (name, description) VALUES
('UX Psychology', 'Psychological principles that underpin user experience design'),
('Neuroscience', 'Brain-based insights about cognition and perception'),
('Visual Design', 'Principles of visual communication and aesthetics'),
('Interaction Design', 'How users interact with interfaces and systems'),
('Cognitive Science', 'Mental processes and information processing');

-- Contexts (Decision Environments)
INSERT INTO contexts (name, description, icon) VALUES
('Data Entry & Forms', 'Input validation, form completion, manual data capture', 'input'),
('Decision & Approvals', 'Risk assessment, validation, authorization workflows', 'gavel'),
('Navigation & Search', 'Finding information, wayfinding, discovery patterns', 'explore'),
('Monitoring & Alerts', 'Dashboards, notifications, anomaly detection', 'monitoring'),
('Collaboration & Handover', 'Team workflows, knowledge transfer, coordination', 'handshake');

-- Problems
INSERT INTO problems (name, description, icon) VALUES
('Alert Fatigue', 'Too many notifications causing important ones to be missed', 'notifications_off'),
('Form Abandonment', 'Users starting but not completing forms', 'assignment_late'),
('Error Rate', 'High frequency of user mistakes or system errors', 'error'),
('Decision Paralysis', 'Inability to make decisions due to complexity or choice overload', 'psychology'),
('Trust Issues', 'Users lacking confidence in system or information', 'security'),
('Risk Communication', 'Difficulty conveying uncertainty or probability', 'warning'),
('Information Overload', 'Too much data presented at once', 'filter_list');

-- Sectors (Workflow-based taxonomy)
INSERT INTO sectors (name, description) VALUES
('Commercial workflows', 'CRM, customer management, sales operations'),
('Document workflows', 'DMS, content management, document processing'),
('Quoting & approvals', 'Pricing, proposals, authorization chains'),
('Laboratory operations', 'LIMS, sample processing, test management'),
('Results & reporting', 'Analytics, dashboards, outcome communication'),
('Compliance workflows', 'Audit trails, regulatory requirements, validation');

-- Sample Principles
INSERT INTO principles (name, definition, discipline_id, mechanism, cognitive_load_impact, evidence_strength, founder, source, year, icon) VALUES
('Hick''s Law', 'Decision time increases logarithmically with the number of choices available', 
 (SELECT id FROM disciplines WHERE name = 'UX Psychology'),
 'Limits cognitive processing capacity by reducing choice complexity',
 'low', 'strong', 'William Edmund Hick', 'Journal of Experimental Psychology', 1952, 'linear_scale'),

('Miller''s Law', 'The average person can hold 7±2 items in working memory',
 (SELECT id FROM disciplines WHERE name = 'Cognitive Science'),
 'Optimizes information chunking for memory retention',
 'medium', 'strong', 'George Miller', 'Psychological Review', 1956, 'grid_view'),

('Fitts''s Law', 'The time to acquire a target is a function of the distance and size of the target',
 (SELECT id FROM disciplines WHERE name = 'Interaction Design'),
 'Reduces motor effort through optimal target sizing and placement',
 'low', 'strong', 'Paul Fitts', 'Journal of Experimental Psychology', 1954, 'architecture'),

('Recognition over Recall', 'It is easier to recognize something than to recall it from memory',
 (SELECT id FROM disciplines WHERE name = 'UX Psychology'),
 'Leverages pattern recognition instead of memory retrieval',
 'low', 'strong', 'Donald Norman', 'The Design of Everyday Things', 1988, 'visibility'),

('Progressive Disclosure', 'Sequence information and actions across multiple screens to reduce complexity',
 (SELECT id FROM disciplines WHERE name = 'Interaction Design'),
 'Manages cognitive load by revealing information incrementally',
 'low', 'moderate', 'Jakob Nielsen', 'Nielsen Norman Group', 2006, 'unfold_more');

-- Sample Actions for Hick's Law
INSERT INTO principle_actions (principle_id, action_title, action_description, ui_pattern, anti_pattern, when_to_use, when_not_to_use, order_index) VALUES
((SELECT id FROM principles WHERE name = 'Hick''s Law'), 
 'Limit Primary Actions', 'Restrict main actions to 3-5 options maximum', 
 'Primary action buttons, dropdown menus, action groups',
 'Showing all options at once with equal visual weight',
 'When users need to make quick decisions or complete tasks efficiently',
 'When all options are equally important and frequently used', 1),

((SELECT id FROM principles WHERE name = 'Hick''s Law'),
 'Group Secondary Actions', 'Place less common actions under "More" or secondary menus',
 'Dropdown menus, overflow menus, hierarchical navigation',
 'Long lists of equally weighted options',
 'When there are many possible actions but only a few are frequently needed',
 'When all actions are time-critical and equally important', 2),

((SELECT id FROM principles WHERE name = 'Hick''s Law'),
 'Use Smart Defaults', 'Pre-select the most likely option based on user context or history',
 'Default selections, personalized recommendations, contextual suggestions',
 'No default selection or random defaults',
 'When you can reliably predict user preferences or best practices',
 'When all options are equally valid and context-dependent', 3);

-- Sample Examples for Hick's Law
INSERT INTO principle_examples (principle_id, sector_id, example_type, scenario, example_text, impact_metrics) VALUES
((SELECT id FROM principles WHERE name = 'Hick''s Law'),
 (SELECT id FROM sectors WHERE name = 'Laboratory operations'),
 'success',
 'Test Ordering Interface',
 'Reduced test catalogue from 200+ options to 12 common panels, with "Advanced Tests" in dropdown. Result: 60% faster test selection, 40% reduction in ordering errors.',
 '{"time_reduction": "60%", "error_reduction": "40%", "user_satisfaction": "+35%"}'),

((SELECT id FROM principles WHERE name = 'Hick''s Law'),
 (SELECT id FROM sectors WHERE name = 'Quoting & approvals'),
 'success',
 'Sales Proposal Templates',
 'Instead of 50+ service options, presented 5 pre-configured packages with "Customize" option. Result: 75% faster quote generation, higher closing rates.',
 '{"time_reduction": "75%", "conversion_rate": "+22%", "training_time": "-50%"}');

-- Sample Relevance Rules (Recommendation Engine)
INSERT INTO principle_relevance_rules (principle_id, problem_id, context_id, sector_id, relevance_score, reasoning) VALUES
-- High relevance for decision paralysis in data entry
((SELECT id FROM principles WHERE name = 'Hick''s Law'),
 (SELECT id FROM problems WHERE name = 'Decision Paralysis'),
 (SELECT id FROM contexts WHERE name = 'Data Entry & Forms'),
 NULL, 95,
 'Directly addresses choice overload in form completion scenarios'),

-- High relevance for form abandonment
((SELECT id FROM principles WHERE name = 'Progressive Disclosure'),
 (SELECT id FROM problems WHERE name = 'Form Abandonment'),
 (SELECT id FROM contexts WHERE name = 'Data Entry & Forms'),
 NULL, 90,
 'Reduces perceived complexity and increases completion rates'),

-- Context-specific for lab operations
((SELECT id FROM principles WHERE name = 'Hick''s Law'),
 (SELECT id FROM problems WHERE name = 'Error Rate'),
 (SELECT id FROM contexts WHERE name = 'Navigation & Search'),
 (SELECT id FROM sectors WHERE name = 'Laboratory operations'), 88,
 'Lab staff need quick access to critical tests without cognitive overload'),

-- Recognition over recall for document workflows
((SELECT id FROM principles WHERE name = 'Recognition over Recall'),
 (SELECT id FROM problems WHERE name = 'Information Overload'),
 (SELECT id FROM contexts WHERE name = 'Navigation & Search'),
 (SELECT id FROM sectors WHERE name = 'Document workflows'), 85,
 'Document management benefits from visual recognition rather than memory recall');
