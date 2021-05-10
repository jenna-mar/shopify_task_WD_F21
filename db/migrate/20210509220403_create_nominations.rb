class CreateNominations < ActiveRecord::Migration[5.0]
  def change
    create_table :nominations do |t|
      t.string :title
      t.integer :year
      t.string :imdbID

      t.timestamps
    end
  end
end
